import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { JwtAuthService } from '../services/jwt-auth.service';

/**
 * Rutas públicas de auth (login, signup, reset).
 * Si autenticado y sesión válida → redirect post-login.
 * Si autenticado pero validación falla → permitir entrar a la ruta pública.
 */
@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: JwtAuthService
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | boolean | UrlTree {
    if (!this.auth.isAuthenticated()) {
      return true;
    }

    return this.auth.ensureSessionValid().pipe(
      map(ok => {
        if (ok) {
          return this.router.createUrlTree([this.auth.getPostLoginRedirect()]);
        }
        return true;
      }),
      catchError(() => of(true))
    );
  }
}
