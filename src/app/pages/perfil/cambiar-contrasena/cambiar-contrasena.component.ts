import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { moduleEnterAnimation } from 'src/app/core/animations/module-enter.animation';
import { pwdMensajeAnimation, pwdReglaAnimation } from 'src/app/core/animations/pwd-feedback.animation';

interface ReglaContrasena {
  id: string;
  texto: string;
  cumple: (valor: string) => boolean;
}

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrl: './cambiar-contrasena.component.scss',
  animations: [moduleEnterAnimation, pwdReglaAnimation, pwdMensajeAnimation]
})
export class CambiarContrasenaComponent {
  form: FormGroup;
  enviando = false;
  mostrarActual = false;
  mostrarNueva = false;
  mostrarConfirmar = false;
  nuevaEnFoco = false;

  readonly reglas: ReglaContrasena[] = [
    {
      id: 'minLength',
      texto: 'Mínimo 8 caracteres',
      cumple: (valor) => valor.length >= 8
    },
    {
      id: 'uppercase',
      texto: 'Al menos una letra mayúscula',
      cumple: (valor) => /[A-ZÁÉÍÓÚÑ]/.test(valor)
    },
    {
      id: 'lowercase',
      texto: 'Al menos una letra minúscula',
      cumple: (valor) => /[a-záéíóúñ]/.test(valor)
    },
    {
      id: 'numberOrSymbol',
      texto: 'Al menos un número o símbolo',
      cumple: (valor) => /[\d]/.test(valor) || /[^a-zA-Z0-9\s]/.test(valor)
    }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      contrasenaActual: ['', Validators.required],
      contrasenaNueva: ['', [Validators.required, this.validarFortaleza.bind(this)]],
      confirmarContrasena: ['', Validators.required]
    }, { validators: this.validarConfirmacion.bind(this) });
  }

  get valorNueva(): string {
    return this.form.get('contrasenaNueva')?.value ?? '';
  }

  get valorConfirmar(): string {
    return this.form.get('confirmarContrasena')?.value ?? '';
  }

  get reglasPendientes(): ReglaContrasena[] {
    return this.reglas.filter((regla) => !regla.cumple(this.valorNueva));
  }

  get mostrarReglasNueva(): boolean {
    return this.nuevaEnFoco || this.valorNueva.length > 0;
  }

  get contrasenaSegura(): boolean {
    return this.valorNueva.length > 0 && this.reglasPendientes.length === 0;
  }

  get mostrarValidacionConfirmar(): boolean {
    return this.valorConfirmar.length > 0;
  }

  get confirmacionCoincide(): boolean {
    return this.valorConfirmar.length > 0 && this.valorNueva === this.valorConfirmar;
  }

  get confirmacionNoCoincide(): boolean {
    return this.valorConfirmar.length > 0 && this.valorNueva !== this.valorConfirmar;
  }

  private validarFortaleza(control: AbstractControl): ValidationErrors | null {
    const valor = control.value ?? '';
    if (!valor) {
      return null;
    }

    const pendientes = this.reglas.filter((regla) => !regla.cumple(valor));
    return pendientes.length ? { fortalezaInvalida: true } : null;
  }

  private validarConfirmacion(group: AbstractControl): ValidationErrors | null {
    const nueva = group.get('contrasenaNueva')?.value ?? '';
    const confirmar = group.get('confirmarContrasena')?.value ?? '';

    if (!confirmar) {
      return null;
    }

    return nueva !== confirmar ? { noCoinciden: true } : null;
  }

  trackRegla(_index: number, regla: ReglaContrasena): string {
    return regla.id;
  }

  cancelar(): void {
    this.router.navigate(['/perfil/mi-cuenta']);
  }

  confirmar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando = true;
    setTimeout(() => {
      this.enviando = false;
      this.router.navigate(['/perfil/mi-cuenta']);
    }, 800);
  }
}
