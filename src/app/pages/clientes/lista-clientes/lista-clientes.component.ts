import { Component } from '@angular/core';
import { moduleEnterAnimation } from 'src/app/core/animations/module-enter.animation';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrl: './lista-clientes.component.scss',
  animations: [moduleEnterAnimation]
})
export class ListaClientesComponent {
  listaClientes = [
    { id: 1, nombre: 'Aguas del Norte SA', rfc: 'ADN850101ABC', estatus: 'Activo' },
    { id: 2, nombre: 'Sistema Hidráulico Central', rfc: 'SHC920315XYZ', estatus: 'Activo' },
    { id: 3, nombre: 'Distribuidora Pacífico', rfc: 'DPA780620DEF', estatus: 'Inactivo' },
  ];
}
