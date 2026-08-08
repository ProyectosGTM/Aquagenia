import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DxDataGridModule,
  DxDateBoxModule,
  DxNumberBoxModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxSwitchModule,
  DxTagBoxModule,
  DxTemplateModule,
  DxTextAreaModule,
  DxTextBoxModule,
} from 'devextreme-angular';

import { SharedModule } from 'src/app/shared/shared.module';
import { AlarmasRoutingModule } from './alarmas-routing.module';
import { ListaAlarmasComponent } from './lista-alarmas/lista-alarmas.component';
import { ContactosAlarmasComponent } from './contactos-alarmas/contactos-alarmas.component';

@NgModule({
  declarations: [ListaAlarmasComponent, ContactosAlarmasComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    AlarmasRoutingModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxPopupModule,
    DxSelectBoxModule,
    DxSwitchModule,
    DxTagBoxModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxNumberBoxModule,
    DxTemplateModule,
  ],
})
export class AlarmasModule {}
