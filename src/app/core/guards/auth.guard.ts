import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { JwtAuthService } from '../services/jwt-auth.service';

/**
 * Guard de sesión únicamente (sin RBAC).
 * Redirect a /account/login sin query params.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: JwtAuthService
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | boolean | UrlTree {
    if (!this.auth.isAuthenticated()) {
      return this.router.createUrlTree(['/account/login']);
    }

    return this.auth.ensureSessionValid().pipe(
      map(ok => (ok ? true : this.router.createUrlTree(['/account/login']))),
      catchError(() =>
        of(this.auth.isAuthenticated() ? true : this.router.createUrlTree(['/account/login']))
      )
    );
  }
}
