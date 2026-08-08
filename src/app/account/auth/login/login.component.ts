import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { JwtAuthService } from '../../../core/services/jwt-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

  loginForm: UntypedFormGroup;
  submitted = false;
  loading = false;
  showPassword = false;

  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private auth: JwtAuthService
  ) {}

  ngOnInit() {
    document.body.setAttribute('class', 'authentication-bg');

    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    document.body.classList.remove('authentication-bg');
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.auth
      .login({
        userName: this.f.userName.value,
        password: this.f.password.value,
      })
      .pipe(first())
      .subscribe({
        next: () => {
          this.loading = false;
          document.body.removeAttribute('class');
          this.router.navigateByUrl(this.auth.getPostLoginRedirect());
        },
        error: err => {
          this.loading = false;
          Swal.fire({
            title: '¡Ops!',
            text: JwtAuthService.extractErrorMessage(err),
            icon: 'error',
            confirmButtonColor: '#c9a227',
            confirmButtonText: 'Entendido',
            allowOutsideClick: false,
            background: '#141a21',
            color: '#ffffff',
          });
        },
      });
  }
}
