import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpContextToken,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { JwtAuthService } from '../services/jwt-auth.service';

/** Marca que la request ya se reintentó una vez tras refresh */
export const AUTH_RETRIED_AFTER_REFRESH = new HttpContextToken<boolean>(() => false);

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private injector: Injector) {}

  private get auth(): JwtAuthService {
    return this.injector.get(JwtAuthService);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 3.1 Excepción S3
    if (this.isS3Url(request.url)) {
      return next.handle(request);
    }

    const accessToken = this.auth.getToken();
    const authEndpoint = this.isAuthEndpoint(request.url);
    const hadAuth = !!(accessToken && !authEndpoint);

    let authReq = request;
    if (hadAuth) {
      authReq = this.addBearer(request, accessToken);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!(error instanceof HttpErrorResponse)) {
          return throwError(() => error);
        }

        if (this.shouldAttemptRefresh(error, authReq, hadAuth)) {
          return this.handle401Error(authReq, next);
        }

        if (this.shouldForceLogin(error, authReq, hadAuth)) {
          this.auth.clearSessionAndRedirect();
        }

        return throwError(() => error);
      })
    );
  }

  private isS3Url(url: string): boolean {
    return (url || '').includes('amazonaws.com');
  }

  /**
   * isAuthEndpoint: /login/me NO es excluido; resto de /login/* sí.
   */
  isAuthEndpoint(url: string): boolean {
    try {
      const path = this.getPathname(url);
      if (path.includes('/login/me')) {
        return false;
      }
      return /\/login(\/|$)/.test(path);
    } catch {
      const u = url || '';
      if (u.includes('/login/me')) {
        return false;
      }
      return /\/login(\/|$)/.test(u);
    }
  }

  private getPathname(url: string): string {
    if (!url) {
      return '';
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return new URL(url).pathname;
    }
    const withoutQuery = url.split('?')[0];
    return withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
  }

  private addBearer(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  private shouldAttemptRefresh(
    error: HttpErrorResponse,
    request: HttpRequest<any>,
    hadAuth: boolean
  ): boolean {
    const status = error.status;
    const url = request.url || '';

    if (this.auth.isRefreshBlocked()) {
      return false;
    }
    if (request.context.get(AUTH_RETRIED_AFTER_REFRESH)) {
      return false;
    }
    if (url.includes('/login/refresh') || url.includes('/login/logout')) {
      return false;
    }
    if (this.isAuthEndpoint(url)) {
      return false;
    }

    if (status === 401) {
      return true;
    }
    if (status === 403 && hadAuth) {
      return true;
    }
    return false;
  }

  private shouldForceLogin(
    error: HttpErrorResponse,
    request: HttpRequest<any>,
    hadAuth: boolean
  ): boolean {
    const status = error.status;
    if (status !== 401 && status !== 403) {
      return false;
    }
    if (!hadAuth) {
      return false;
    }
    if (this.isAuthEndpoint(request.url)) {
      return false;
    }

    const alreadyRetried = request.context.get(AUTH_RETRIED_AFTER_REFRESH);
    const noRefresh = !this.auth.getRefreshToken();
    return alreadyRetried || this.auth.isRefreshBlocked() || noRefresh;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.auth.getRefreshToken()) {
      this.auth.clearSessionAndRedirect();
      return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'No refreshToken' }));
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.auth.refreshToken().pipe(
        switchMap(tokens => {
          this.isRefreshing = false;
          const newAccess = tokens.token || this.auth.getToken() || '';
          this.refreshTokenSubject.next(newAccess);

          if (!newAccess) {
            this.auth.clearSessionAndRedirect();
            return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Empty token after refresh' }));
          }

          return next.handle(this.retryWithToken(request, newAccess));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next('');
          return throwError(() => err);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        if (!token) {
          this.auth.clearSessionAndRedirect();
          return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Refresh failed' }));
        }
        return next.handle(this.retryWithToken(request, token));
      })
    );
  }

  private retryWithToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return this.addBearer(request, token).clone({
      context: request.context.set(AUTH_RETRIED_AFTER_REFRESH, true),
    });
  }
}
