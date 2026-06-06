import { Component } from '@angular/core';
import { moduleEnterAnimation } from 'src/app/core/animations/module-enter.animation';

@Component({
  selector: 'app-lista-permisos',
  templateUrl: './lista-permisos.component.html',
  styleUrl: './lista-permisos.component.scss',
  animations: [moduleEnterAnimation]
})
export class ListaPermisosComponent {
  listaPermisos = [
    { id: 1, nombre: 'Ver dashboard', clave: 'DASH_VIEW', estatus: 'Activo' },
    { id: 2, nombre: 'Editar usuarios', clave: 'USER_EDIT', estatus: 'Activo' },
    { id: 3, nombre: 'Eliminar registros', clave: 'REC_DELETE', estatus: 'Inactivo' },
  ];
}
