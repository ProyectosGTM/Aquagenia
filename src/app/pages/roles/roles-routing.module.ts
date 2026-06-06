import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaRolesComponent } from './lista-roles/lista-roles.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'lista-roles',
    pathMatch: 'full'
  },
  {
    path: 'lista-roles',
    component: ListaRolesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
