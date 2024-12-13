import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaEstacionesComponent } from './lista-estaciones/lista-estaciones.component';
import { DetalleEstacionComponent } from './detalle-estacion/detalle-estacion.component';

const routes: Routes = [
  {
      path: 'lista-estaciones',
      component: ListaEstacionesComponent
  },
  {
    path: 'detalle-estaciones',
    component: DetalleEstacionComponent
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstacionesRoutingModule { }
