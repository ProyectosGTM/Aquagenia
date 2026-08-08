import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TablerosGeneralComponent } from './general/tableros-general.component';
import { TablerosDetalleComponent } from './detalle/tableros-detalle.component';

/** Vista general en la raíz → URL final: /tablero */
const routes: Routes = [
  { path: '', component: TablerosGeneralComponent },
  { path: 'detalle/:id', component: TablerosDetalleComponent },
  // compatibilidad
  { path: 'lista-tableros', redirectTo: '', pathMatch: 'full' },
  { path: 'detalle-tableros/:id', component: TablerosDetalleComponent },
  { path: 'general', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablerosRoutingModule {}
