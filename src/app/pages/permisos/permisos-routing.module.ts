import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaPermisosComponent } from './lista-permisos/lista-permisos.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'lista-permisos',
    pathMatch: 'full'
  },
  {
    path: 'lista-permisos',
    component: ListaPermisosComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermisosRoutingModule { }
