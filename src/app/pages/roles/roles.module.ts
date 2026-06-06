import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridModule } from 'devextreme-angular';

import { RolesRoutingModule } from './roles-routing.module';
import { ListaRolesComponent } from './lista-roles/lista-roles.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ListaRolesComponent],
  imports: [
    CommonModule,
    RolesRoutingModule,
    NgbTooltipModule,
    DxDataGridModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class RolesModule { }
