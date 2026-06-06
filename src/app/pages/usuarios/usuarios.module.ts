import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridModule } from 'devextreme-angular';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ListaUsuariosComponent],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    NgbTooltipModule,
    DxDataGridModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class UsuariosModule { }
