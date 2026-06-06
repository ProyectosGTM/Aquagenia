import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridModule } from 'devextreme-angular';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ListaClientesComponent],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    NgbTooltipModule,
    DxDataGridModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class ClientesModule { }
