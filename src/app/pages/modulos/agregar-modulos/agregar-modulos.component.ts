import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { moduleEnterAnimation } from 'src/app/core/animations/module-enter.animation';
import { ModuloRequest } from '../models/modulo.model';
import { ModulosService } from '../servicios/modulos.service';

@Component({
  selector: 'app-agregar-modulos',
  templateUrl: './agregar-modulos.component.html',
  styleUrl: './agregar-modulos.component.scss',
  animations: [moduleEnterAnimation],
})
export class AgregarModulosComponent implements OnInit {
  form: FormGroup;
  enviando = false;
  cargando = false;
  esEdicion = false;
  idModulo: number | null = null;

  readonly opcionesEstatus = [
    { valor: 1, texto: 'Activo' },
    { valor: 0, texto: 'Inactivo' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private modulosService: ModulosService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(120)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      estatus: [1, Validators.required],
    });
  }

  ngOnInit(): void {
    const rawId = this.route.snapshot.paramMap.get('idModulo');
    if (rawId) {
      this.esEdicion = true;
      this.idModulo = Number(rawId);
      this.cargarModulo(this.idModulo);
    }
  }

  get tituloPagina(): string {
    return this.esEdicion ? 'Editar' : 'Nuevo';
  }

  private cargarModulo(id: number): void {
    this.cargando = true;
    this.modulosService.obtenerPorId(id).subscribe({
      next: (modulo) => {
        this.form.patchValue({
          nombre: modulo.nombre,
          descripcion: modulo.descripcion,
          estatus: Number(modulo.estatus),
        });
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar el módulo.',
          icon: 'error',
          confirmButtonColor: '#166c9f',
          background: '#141a21',
          color: '#ffffff',
        }).then(() => this.cancelar());
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/modulos/lista-modulos']);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: ModuloRequest = {
      nombre: String(this.form.value.nombre ?? '').trim(),
      descripcion: String(this.form.value.descripcion ?? '').trim(),
      estatus: Number(this.form.value.estatus),
    };

    this.enviando = true;
    const request$ =
      this.esEdicion && this.idModulo != null
        ? this.modulosService.actualizar(this.idModulo, body)
        : this.modulosService.crear(body);

    request$.subscribe({
      next: () => {
        this.enviando = false;
        Swal.fire({
          title: 'Listo',
          text: this.esEdicion
            ? 'El módulo se actualizó correctamente.'
            : 'El módulo se creó correctamente.',
          icon: 'success',
          confirmButtonColor: '#166c9f',
          background: '#141a21',
          color: '#ffffff',
        }).then(() => this.router.navigate(['/modulos/lista-modulos']));
      },
      error: () => {
        this.enviando = false;
        Swal.fire({
          title: 'Error',
          text: this.esEdicion
            ? 'No se pudo actualizar el módulo.'
            : 'No se pudo crear el módulo.',
          icon: 'error',
          confirmButtonColor: '#166c9f',
          background: '#141a21',
          color: '#ffffff',
        });
      },
    });
  }

  campoInvalido(nombre: string): boolean {
    const control = this.form.get(nombre);
    return !!(control && control.invalid && control.touched);
  }
}
