import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthenticationService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})
export class PasswordresetComponent implements OnInit, AfterViewInit, OnDestroy {

  resetForm: UntypedFormGroup;
  submitted = false;
  loading = false;

  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    document.body.setAttribute('class', 'authentication-bg');
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    document.body.classList.remove('authentication-bg');
  }

  get f() {
    return this.resetForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.resetForm.invalid) {
      return;
    }

    if (environment.defaultauth === 'firebase') {
      this.authenticationService
        .resetPassword(this.f.email.value)
        .then(() => {
          Swal.fire({
            title: 'Listo',
            text: 'Revisa tu correo para restablecer el acceso.',
            icon: 'success',
            confirmButtonColor: '#c9a227',
            confirmButtonText: 'Entendido',
            allowOutsideClick: false,
            background: '#141a21',
            color: '#ffffff',
          });
        })
        .catch(error => {
          Swal.fire({
            title: '¡Ops!',
            text: error ? String(error) : 'No se pudo enviar la solicitud.',
            icon: 'error',
            confirmButtonColor: '#c9a227',
            confirmButtonText: 'Entendido',
            allowOutsideClick: false,
            background: '#141a21',
            color: '#ffffff',
          });
        });
      return;
    }

    // JWT: conectar con /login/usuario/recuperar/acceso cuando esté disponible
    Swal.fire({
      title: 'Listo',
      text: 'Si el correo existe, recibirás instrucciones para restablecer el acceso.',
      icon: 'success',
      confirmButtonColor: '#c9a227',
      confirmButtonText: 'Entendido',
      allowOutsideClick: false,
      background: '#141a21',
      color: '#ffffff',
    });
  }
}
