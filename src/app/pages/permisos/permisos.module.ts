import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridModule } from 'devextreme-angular';

import { PermisosRoutingModule } from './permisos-routing.module';
import { ListaPermisosComponent } from './lista-permisos/lista-permisos.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ListaPermisosComponent],
  imports: [
    CommonModule,
    PermisosRoutingModule,
    NgbTooltipModule,
    DxDataGridModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class PermisosModule { }
