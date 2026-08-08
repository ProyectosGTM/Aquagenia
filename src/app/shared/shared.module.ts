import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular';

import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { HistorialLecturasComponent } from './components/historial-lecturas/historial-lecturas.component';
import { EstacionesMapWidgetComponent } from './components/estaciones-map-widget/estaciones-map-widget.component';
import { RadialHubComponent } from './components/radial-hub/radial-hub.component';
import { UIModule } from './ui/ui.module';

@NgModule({
  declarations: [
    KpiCardComponent,
    HistorialLecturasComponent,
    EstacionesMapWidgetComponent,
    RadialHubComponent,
  ],
  imports: [CommonModule, DxDataGridModule, UIModule],
  exports: [
    UIModule,
    KpiCardComponent,
    HistorialLecturasComponent,
    EstacionesMapWidgetComponent,
    RadialHubComponent,
  ],
})
export class SharedModule {}
