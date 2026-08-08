import { Component, Input, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';

export interface LecturaHistorica {
  gastoInstantaneo?: number;
  gastoAcumulado?: number;
  phCarcamo?: number;
  phEnvio?: number;
  clarificador?: number;
  demandaQuimica?: number;
  oxigenoDisuelto?: number;
  nitrogenoAmoniacal?: number;
  cloroResidual?: number;
  fecha?: string;
  [key: string]: unknown;
}

@Component({
  selector: 'app-historial-lecturas',
  templateUrl: './historial-lecturas.component.html',
  styleUrls: ['./historial-lecturas.component.scss'],
})
export class HistorialLecturasComponent {
  @Input() dataSource: LecturaHistorica[] = [];
  @Input() title = 'Historial de lecturas';
  @Input() subtitle = 'Registros de la estación';
  @Input() showToolbar = true;

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid?: DxDataGridComponent;

  autoExpandAllGroups = true;
  mensajeAgrupar = 'Arrastre un encabezado de columna aquí para agrupar por esa columna';
  showFilterRow = true;
  showHeaderFilter = true;

  toggleExpandGroups(): void {
    this.autoExpandAllGroups = !this.autoExpandAllGroups;
  }

  limpiarCampos(): void {
    const instance = this.dataGrid?.instance;
    if (!instance) {
      return;
    }
    instance.clearFilter();
    instance.clearSorting();
    instance.clearGrouping();
    instance.clearSelection();
    instance.pageIndex(0);
  }
}
