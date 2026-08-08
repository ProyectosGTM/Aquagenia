import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DxChartModule,
  DxCircularGaugeModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxPieChartModule,
  DxSelectBoxModule,
  DxTemplateModule,
} from 'devextreme-angular';

import { SharedModule } from 'src/app/shared/shared.module';
import { TablerosRoutingModule } from './tableros-routing.module';
import { TablerosGeneralComponent } from './general/tableros-general.component';
import { TablerosDetalleComponent } from './detalle/tableros-detalle.component';

@NgModule({
  declarations: [TablerosGeneralComponent, TablerosDetalleComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TablerosRoutingModule,
    DxChartModule,
    DxCircularGaugeModule,
    DxDataGridModule,
    DxPieChartModule,
    DxTemplateModule,
    DxSelectBoxModule,
    DxDateBoxModule,
  ],
})
export class TablerosModule {}
