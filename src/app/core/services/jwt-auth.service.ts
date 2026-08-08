import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, shareReplay, switchMap, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthTokens, AuthUser, LoginCredentials } from '../models/auth.models';

const STORAGE_KEYS = [
  'token',
  'refreshToken',
  'user',
  'permissions',
  'coordinates',
  'authSessionActive',
] as const;

@Injectable({ providedIn: 'root' })
export class JwtAuthService {
  private readonly apiBase = environment.apiBase.replace(/\/$/, '');

  /** HTTP sin interceptores (refresh / logout). */
  private readonly rawHttp: HttpClient;

  private user: AuthUser | null = null;
  private sessionValidated = false;
  private sessionCheck$: Observable<boolean> | null = null;
  private refreshBlocked = false;

  private readonly authChangedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  readonly authenticationChanged$ = this.authChangedSubject.asObservable();

  constructor(
    private http: HttpClient,
    httpBackend: HttpBackend,
    private router: Router
  ) {
    this.rawHttp = new HttpClient(httpBackend);
    this.bootstrapSession();
  }

  // ─── Lectura / escritura storage ───────────────────────────────────────────

  private readTokenValue(key: 'token' | 'refreshToken'): string {
    const raw = sessionStorage.getItem(key);
    if (raw === null || raw === undefined || raw === '' || raw === 'null' || raw === 'undefined') {
      return '';
    }
    const trimmed = raw.trim();
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === 'string') {
          return parsed === 'null' || parsed === 'undefined' ? '' : parsed;
        }
      } catch {
        /* devolver raw */
      }
    }
    return raw;
  }

  getToken(): string {
    return this.readTokenValue('token');
  }

  getRefreshToken(): string {
    return this.readTokenValue('refreshToken');
  }

  getUser(): AuthUser | null {
    if (this.user) {
      return this.user;
    }
    const raw = sessionStorage.getItem('user');
    if (!raw || raw === 'null' || raw === 'undefined') {
      return null;
    }
    try {
      this.user = JSON.parse(raw) as AuthUser;
      return this.user;
    } catch {
      return null;
    }
  }

  getPermissions(): string[] {
    const raw = sessionStorage.getItem('permissions');
    if (!raw || raw === 'null' || raw === 'undefined') {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }

  hasPermission(id: string | number): boolean {
    return this.getPermissions().includes(String(id));
  }

  /**
   * isAuthenticated = (authSessionActive === "1") AND (hay token OR hay refreshToken)
   */
  isAuthenticated(): boolean {
    const flag = sessionStorage.getItem('authSessionActive') === '1';
    if (!flag) {
      return false;
    }
    return !!(this.getToken() || this.getRefreshToken());
  }

  isRefreshBlocked(): boolean {
    return this.refreshBlocked;
  }

  blockRefresh(): void {
    this.refreshBlocked = true;
  }

  resetSessionState(): void {
    this.refreshBlocked = false;
    this.sessionValidated = false;
    this.sessionCheck$ = null;
  }

  // ─── Bootstrap: sin flag → purgar restos ───────────────────────────────────

  private bootstrapSession(): void {
    const active = sessionStorage.getItem('authSessionActive') === '1';
    if (active) {
      this.user = this.getUser();
      return;
    }
    if (this.hasAuthResidue()) {
      this.purgeAuthKeys();
    }
  }

  private hasAuthResidue(): boolean {
    const storages: Storage[] = [sessionStorage, localStorage];
    return storages.some(s =>
      STORAGE_KEYS.some(k => {
        const v = s.getItem(k);
        return v !== null && v !== undefined && v !== '';
      })
    );
  }

  private purgeAuthKeys(): void {
    for (const key of STORAGE_KEYS) {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    }
    // legado template Minible
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('authUser');
  }

  private persistTokens(tokens: AuthTokens): void {
    if (tokens.token) {
      sessionStorage.setItem('token', tokens.token);
    }
    if (tokens.refreshToken) {
      sessionStorage.setItem('refreshToken', tokens.refreshToken);
    }
  }

  private extractTokens(payload: any): AuthTokens {
    if (!payload || typeof payload !== 'object') {
      return {};
    }
    const data = payload.data && typeof payload.data === 'object' ? payload.data : null;

    const pickAccess = (obj: any): string => {
      if (!obj) return '';
      const v = obj.token ?? obj.accessToken ?? obj.access_token;
      return typeof v === 'string' && v && v !== 'null' && v !== 'undefined' ? v : '';
    };
    const pickRefresh = (obj: any): string => {
      if (!obj) return '';
      const v = obj.refreshToken ?? obj.refresh_token;
      return typeof v === 'string' && v && v !== 'null' && v !== 'undefined' ? v : '';
    };

    let token = pickAccess(data);
    let refreshToken = pickRefresh(data);
    if (!token) {
      token = pickAccess(payload);
    }
    if (!refreshToken) {
      refreshToken = pickRefresh(payload);
    }
    return {
      ...(token ? { token } : {}),
      ...(refreshToken ? { refreshToken } : {}),
    };
  }

  private normalizePermissions(permisos: AuthUser['permisos']): string[] {
    if (!Array.isArray(permisos)) {
      return [];
    }
    return permisos.map(p => {
      if (p !== null && typeof p === 'object' && 'idPermiso' in p && (p as any).idPermiso != null) {
        return String((p as any).idPermiso);
      }
      return String(p);
    });
  }

  private emitAuthChanged(): void {
    this.authChangedSubject.next(this.isAuthenticated());
  }

  // ─── Login ─────────────────────────────────────────────────────────────────

  /**
   * POST /login → persist tokens → GET /login/me → activar sesión
   */
  login(credentials: LoginCredentials): Observable<AuthUser> {
    const body = {
      userName: credentials.userName,
      password: credentials.password,
    };

    return this.http
      .post<any>(`${this.apiBase}/login`, body, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        switchMap(payload => {
          this.resetSessionState();
          const tokens = this.extractTokens(payload);
          this.persistTokens(tokens);
          return this.fetchMeAndActivate();
        })
      );
  }

  /** Compat: acepta userName o username */
  authenticate(credentials: { userName?: string; username?: string; password: string }): Observable<AuthUser> {
    return this.login({
      userName: credentials.userName ?? credentials.username ?? '',
      password: credentials.password,
    });
  }

  // ─── /me ───────────────────────────────────────────────────────────────────

  getMe(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.apiBase}/login/me`).pipe(
      tap(user => this.applyMeResponse(user))
    );
  }

  private fetchMeAndActivate(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.apiBase}/login/me`).pipe(
      map(user => {
        this.applyMeResponse(user);
        return user;
      })
    );
  }

  private applyMeResponse(user: AuthUser): void {
    this.user = user;
    sessionStorage.setItem('user', JSON.stringify(user));
    const permissions = this.normalizePermissions(user?.permisos);
    sessionStorage.setItem('permissions', JSON.stringify(permissions));
    sessionStorage.setItem('authSessionActive', '1');
    this.sessionValidated = true;
    this.sessionCheck$ = null;
    this.emitAuthChanged();
  }

  /**
   * Validación de sesión en esta carga de app (deduplicada).
   * Si /me falla → NO limpia tokens; retorna isAuthenticated().
   */
  ensureSessionValid(): Observable<boolean> {
    if (!this.isAuthenticated()) {
      return of(false);
    }
    if (this.sessionValidated) {
      return of(true);
    }
    if (this.sessionCheck$) {
      return this.sessionCheck$;
    }

    this.sessionCheck$ = this.http.get<AuthUser>(`${this.apiBase}/login/me`).pipe(
      map(user => {
        this.applyMeResponse(user);
        return true;
      }),
      catchError(() => of(this.isAuthenticated())),
      finalize(() => {
        this.sessionCheck$ = null;
      }),
      shareReplay(1)
    );

    return this.sessionCheck$;
  }

  // ─── Refresh (solo vía interceptor; HTTP raw) ──────────────────────────────

  /**
   * POST /login/refresh con body { refreshToken }. Sin Bearer. Sin interceptor.
   */
  refreshToken(): Observable<AuthTokens> {
    const refresh = this.getRefreshToken();
    if (!refresh) {
      this.clearSessionAndRedirect();
      return throwError(() => new Error('No refreshToken'));
    }

    return this.rawHttp
      .post<any>(
        `${this.apiBase}/login/refresh`,
        { refreshToken: refresh },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .pipe(
        map(payload => {
          const tokens = this.extractTokens(payload);
          this.persistTokens(tokens);
          this.refreshBlocked = false;
          return tokens;
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401 || err.status === 403) {
            this.blockRefresh();
            this.clearSessionAndRedirect();
          }
          return throwError(() => err);
        })
      );
  }

  // ─── Logout ────────────────────────────────────────────────────────────────

  /**
   * Logout idempotente: sin refresh local → solo limpia; con refresh → API (errores ignorados).
   * Siempre limpia al final.
   */
  logout(): void {
    const refresh = this.getRefreshToken();

    if (!refresh) {
      this.finishLogout();
      return;
    }

    this.rawHttp
      .post(
        `${this.apiBase}/login/logout`,
        { refreshToken: refresh },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .pipe(
        catchError(() => of(null)),
        finalize(() => this.finishLogout())
      )
      .subscribe();
  }

  private finishLogout(): void {
    this.clearSessionOnly();
    this.blockRefresh();
    this.emitAuthChanged();
    this.redirectToLoginIfNeeded();
  }

  clearSessionOnly(): void {
    this.user = null;
    this.sessionValidated = false;
    this.sessionCheck$ = null;
    this.purgeAuthKeys();
  }

  clearSessionAndRedirect(): void {
    this.clearSessionOnly();
    this.blockRefresh();
    this.emitAuthChanged();
    this.redirectToLoginIfNeeded();
  }

  private redirectToLoginIfNeeded(): void {
    const url = this.router.url || '';
    if (this.isPublicAuthRoute(url)) {
      return;
    }
    this.router.navigate(['/account/login']);
  }

  isPublicAuthRoute(url: string): boolean {
    const path = (url || '').split('?')[0].toLowerCase();
    return (
      path.includes('/login') ||
      path.includes('/signup') ||
      path.includes('/change-password') ||
      path.includes('/register') ||
      path.includes('/reset-password') ||
      path.includes('/solicitud-cambio-password') ||
      path.includes('/cambio-password') ||
      path.includes('/password')
    );
  }

  /** Destino post-login: permiso "34" → tablero; si no → perfil */
  getPostLoginRedirect(): string {
    if (this.hasPermission('34')) {
      return '/tablero';
    }
    return '/tablero';
  }

  static extractErrorMessage(error: unknown): string {
    if (!error) {
      return 'Error de autenticación';
    }
    const e = error as any;
    if (e?.error?.message) {
      return String(e.error.message);
    }
    if (typeof e?.message === 'string' && e.message) {
      return e.message;
    }
    if (typeof e === 'string') {
      return e;
    }
    return 'Error de autenticación';
  }
}
