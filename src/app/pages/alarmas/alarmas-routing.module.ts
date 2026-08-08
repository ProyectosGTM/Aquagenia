import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaAlarmasComponent } from './lista-alarmas/lista-alarmas.component';
import { ContactosAlarmasComponent } from './contactos-alarmas/contactos-alarmas.component';

/** Misma convención que usuarios/estaciones: lista-* */
const routes: Routes = [
  { path: '', redirectTo: 'lista-alarmas', pathMatch: 'full' },
  { path: 'lista-alarmas', component: ListaAlarmasComponent },
  { path: 'contactos-alarmas', component: ContactosAlarmasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlarmasRoutingModule {}
