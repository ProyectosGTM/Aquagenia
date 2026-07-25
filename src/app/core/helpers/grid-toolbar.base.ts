import { Directive, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import Swal from 'sweetalert2';

@Directive()
export abstract class GridToolbarBase {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid!: DxDataGridComponent;

  autoExpandAllGroups = true;
  isGrouped = false;

  toggleExpandGroups(): void {
    const grid = this.dataGrid?.instance;
    if (!grid) {
      return;
    }

    const groupedColumns = grid
      .getVisibleColumns()
      .filter((col) => (col.groupIndex ?? -1) >= 0);

    if (groupedColumns.length === 0) {
      Swal.fire({
        title: '¡Ops!',
        text: 'Debes arrastar un encabezado de una columna para expandir o contraer grupos.',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido',
        allowOutsideClick: false,
        background: '#141a21',
        color: '#ffffff',
      });
    } else {
      this.autoExpandAllGroups = !this.autoExpandAllGroups;
      grid.option('grouping.autoExpandAll', this.autoExpandAllGroups);
      grid.refresh();
    }
  }

  limpiarCampos(): void {
    const grid = this.dataGrid?.instance;
    if (!grid) {
      return;
    }

    grid.clearGrouping();
    grid.pageIndex(0);
    grid.refresh();
    this.isGrouped = false;
  }
}
