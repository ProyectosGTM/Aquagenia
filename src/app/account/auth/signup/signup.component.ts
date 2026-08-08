import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';

export interface PasswordRules {
  length: boolean;
  case: boolean;
  special: boolean;
  number: boolean;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit, OnDestroy {

  changePasswordForm: UntypedFormGroup;
  submitted = false;

  year: number = new Date().getFullYear();

  passwordRules: PasswordRules = {
    length: false,
    case: false,
    special: false,
    number: false,
  };

  showPasswordRules = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit() {
    document.body.setAttribute('class', 'authentication-bg');

    this.changePasswordForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, this.passwordStrengthValidator()]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );

    this.changePasswordForm.get('password')?.valueChanges.subscribe((value: string) => {
      this.updatePasswordRules(value || '');
    });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    document.body.classList.remove('authentication-bg');
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  get passwordsMatch(): boolean {
    const password = this.f.password?.value || '';
    const confirm = this.f.confirmPassword?.value || '';
    return !!password && !!confirm && password === confirm;
  }

  get allPasswordRulesMet(): boolean {
    return (
      this.passwordRules.length &&
      this.passwordRules.case &&
      this.passwordRules.special &&
      this.passwordRules.number
    );
  }

  updatePasswordRules(password: string): void {
    this.passwordRules = {
      length: password.length >= 7 && password.length <= 15,
      case: /[A-Z]/.test(password) && /[a-z]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      number: /[0-9]/.test(password),
    };
  }

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      if (!value) {
        return null;
      }

      const valid =
        value.length >= 7 &&
        value.length <= 15 &&
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /[^A-Za-z0-9]/.test(value) &&
        /[0-9]/.test(value);

      return valid ? null : { passwordStrength: true };
    };
  }

  passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (!confirm) {
      return null;
    }
    return password === confirm ? null : { passwordsMismatch: true };
  };

  onPasswordFocus(): void {
    this.showPasswordRules = true;
  }

  onPasswordBlur(): void {
    this.showPasswordRules = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    this.submitted = true;

    if (this.changePasswordForm.invalid) {
      return;
    }

    // Placeholder: conectar con API de cambio de contraseña cuando esté disponible
    Swal.fire({
      title: 'Listo',
      text: 'Contraseña actualizada correctamente.',
      icon: 'success',
      confirmButtonColor: '#c9a227',
      confirmButtonText: 'Entendido',
      allowOutsideClick: false,
      background: '#141a21',
      color: '#ffffff',
    });
  }
}
