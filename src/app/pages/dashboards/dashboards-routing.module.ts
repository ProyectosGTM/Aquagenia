import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/tablero', pathMatch: 'full' },
  { path: 'default', redirectTo: '/tablero', pathMatch: 'full' },
  { path: 'saas', redirectTo: '/tablero', pathMatch: 'full' },
  { path: 'crypto', redirectTo: '/tablero', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardsRoutingModule {}
