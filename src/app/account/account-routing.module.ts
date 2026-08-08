import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'change-password', redirectTo: 'auth/change-password', pathMatch: 'full' },
  { path: 'signup', redirectTo: 'auth/change-password', pathMatch: 'full' },
  { path: 'reset-password', redirectTo: 'auth/reset-password', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
