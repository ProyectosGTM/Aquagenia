import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { moduleEnterAnimation } from 'src/app/core/animations/module-enter.animation';
import { GridToolbarBase } from 'src/app/core/helpers/grid-toolbar.base';
import { Modulo } from '../models/modulo.model';
import { ModulosService } from '../servicios/modulos.service';

@Component({
  selector: 'app-lista-modulos',
  templateUrl: './lista-modulos.component.html',
  styleUrl: './lista-modulos.component.scss',
  animations: [moduleEnterAnimation],
})
export class ListaModulosComponent extends GridToolbarBase implements OnInit {
  listaModulos: Modulo[] = [];
  cargando = false;

  constructor(
    private modulosService: ModulosService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.cargarModulos();
  }

  cargarModulos(): void {
    this.cargando = true;
    this.modulosService.listar().subscribe({
      next: (lista) => {
        this.listaModulos = lista;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar el listado de módulos.',
          icon: 'error',
          confirmButtonColor: '#166c9f',
          background: '#141a21',
          color: '#ffffff',
        });
      },
    });
  }

  irAgregar(): void {
    this.router.navigate(['/modulos/agregar-modulo']);
  }

  irEditar(modulo: Modulo): void {
    this.router.navigate(['/modulos/editar-modulo', modulo.id]);
  }

  estatusTexto(estatus: number): string {
    return Number(estatus) === 1 ? 'Activo' : 'Inactivo';
  }

  estaActivo(modulo: Modulo): boolean {
    return Number(modulo.estatus) === 1;
  }

  cambiarEstatus(modulo: Modulo): void {
    const activo = this.estaActivo(modulo);
    const nuevoEstatus = activo ? 0 : 1;
    const accion = activo ? 'Desactivar' : 'Activar';

    Swal.fire({
      title: `¿${accion} módulo?`,
      text: modulo.nombre,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#166c9f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      background: '#141a21',
      color: '#ffffff',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      this.modulosService.cambiarEstatus(modulo.id, { estatus: nuevoEstatus }).subscribe({
        next: () => {
          this.cargarModulos();
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo cambiar el estatus del módulo.',
            icon: 'error',
            confirmButtonColor: '#166c9f',
            background: '#141a21',
            color: '#ffffff',
          });
        },
      });
    });
  }
}
