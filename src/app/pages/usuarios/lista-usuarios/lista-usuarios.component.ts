import { Component } from '@angular/core';
import { moduleEnterAnimation } from 'src/app/core/animations/module-enter.animation';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.scss',
  animations: [moduleEnterAnimation]
})
export class ListaUsuariosComponent {
  listaUsuarios = [
    { id: 1, nombre: 'Ana García', correo: 'ana.garcia@aquagenia.com', rol: 'Administrador', estatus: 'Activo' },
    { id: 2, nombre: 'Carlos Ruiz', correo: 'carlos.ruiz@aquagenia.com', rol: 'Operador', estatus: 'Activo' },
    { id: 3, nombre: 'María López', correo: 'maria.lopez@aquagenia.com', rol: 'Consultor', estatus: 'Inactivo' },
  ];
}
