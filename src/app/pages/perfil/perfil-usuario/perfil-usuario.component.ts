import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { moduleEnterAnimation } from 'src/app/core/animations/module-enter.animation';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.scss',
  animations: [moduleEnterAnimation]
})
export class PerfilUsuarioComponent {
  usuario = {
    nombre: 'José',
    rol: 'Administrador',
    correo: 'admin@aquagenia.mx',
    telefono: '7773579875',
    empresa: 'Aquagenia Operaciones S.A.',
    telefonoSecundario: '7773265746',
    identificador: 'AQG-001',
    activo: true,
    ultimoAcceso: 'Miércoles, 24 de junio, 17:30',
    avatarUrl: 'assets/images/users/avatar-2.jpg'
  };

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private authFakeService: AuthfakeauthenticationService
  ) {}

  irCambiarContrasena(): void {
    this.router.navigate(['/perfil/cambiar-contrasena']);
  }

  cerrarSesion(): void {
    if (environment.defaultauth === 'firebase') {
      this.authService.logout();
    } else {
      this.authFakeService.logout();
    }
    this.router.navigate(['/account/login']);
  }
}
