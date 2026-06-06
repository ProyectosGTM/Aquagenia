import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIModule } from '../../shared/ui/ui.module';

import { DashboardsRoutingModule } from './dashboards-routing.module';

import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbDropdownModule, NgbTooltipModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap'

import { SimplebarAngularModule } from 'simplebar-angular';
import {
  DxBarGaugeModule,
  DxChartModule,
  DxCircularGaugeModule,
  DxDataGridModule,
  DxPieChartModule,
  DxSparklineModule,
} from 'devextreme-angular';

import { DefaultComponent } from './default/default.component';

@NgModule({
  declarations: [DefaultComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardsRoutingModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbNavModule,
    NgApexchartsModule,
    SimplebarAngularModule,
    UIModule,
    DxSparklineModule,
    DxChartModule,
    DxCircularGaugeModule,
    DxBarGaugeModule,
    DxPieChartModule,
    DxDataGridModule,
  ],
})
export class DashboardsModule { }
