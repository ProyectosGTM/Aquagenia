import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaModulosComponent } from './lista-modulos/lista-modulos.component';
import { AgregarModulosComponent } from './agregar-modulos/agregar-modulos.component';

const routes: Routes = 
[
  {
    path: '',
    redirectTo: 'lista-modulos',
    pathMatch: 'full'
  },
  {
    path: 'lista-modulos',
    component: ListaModulosComponent
  },
  { path: 'agregar-modulo',
    component: AgregarModulosComponent
  },
  {
    path: 'editar-modulo/:idModulo',
    component: AgregarModulosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulosRoutingModule { }
