import { Component } from '@angular/core';
import { moduleEnterAnimation } from 'src/app/core/animations/module-enter.animation';

@Component({
  selector: 'app-lista-roles',
  templateUrl: './lista-roles.component.html',
  styleUrl: './lista-roles.component.scss',
  animations: [moduleEnterAnimation]
})
export class ListaRolesComponent {
  listaRoles = [
    { id: 1, nombre: 'Administrador', descripcion: 'Acceso total al sistema', estatus: 'Activo' },
    { id: 2, nombre: 'Operador', descripcion: 'Gestión operativa diaria', estatus: 'Activo' },
    { id: 3, nombre: 'Consultor', descripcion: 'Solo lectura de reportes', estatus: 'Inactivo' },
  ];
}
