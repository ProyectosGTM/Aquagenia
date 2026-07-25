import { Component } from '@angular/core';
import { moduleEnterAnimation } from 'src/app/core/animations/module-enter.animation';
import { GridToolbarBase } from 'src/app/core/helpers/grid-toolbar.base';

@Component({
  selector: 'app-lista-modulos',
  templateUrl: './lista-modulos.component.html',
  styleUrl: './lista-modulos.component.scss',
  animations: [moduleEnterAnimation]
})
export class ListaModulosComponent extends GridToolbarBase {
  listaModulos = [
    { id: 1, nombre: 'Estaciones', estatus: 'Activo' },
    { id: 2, nombre: 'Reportes', estatus: 'Activo' },
    { id: 3, nombre: 'Configuración', estatus: 'Activo' },
    { id: 4, nombre: 'Históricos', estatus: 'Inactivo' },
  ];
}
