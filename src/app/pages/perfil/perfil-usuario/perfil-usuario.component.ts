import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { moduleEnterAnimation } from 'src/app/core/animations/module-enter.animation';
import { JwtAuthService } from 'src/app/core/services/jwt-auth.service';
import { AuthUser } from 'src/app/core/models/auth.models';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.scss',
  animations: [moduleEnterAnimation]
})
export class PerfilUsuarioComponent implements OnInit {
  usuario = {
    nombre: '',
    rol: '',
    correo: '',
    telefono: '',
    empresa: '',
    telefonoSecundario: '',
    identificador: '',
    activo: true,
    ultimoAcceso: '',
    avatarUrl: 'assets/images/users/avatar-2.jpg'
  };

  constructor(
    private router: Router,
    private auth: JwtAuthService
  ) {}

  ngOnInit(): void {
    const u: AuthUser | null = this.auth.getUser();
    if (!u) {
      return;
    }
    this.usuario = {
      nombre: u.nombreCompleto || [u.nombre, u.apellidoPaterno, u.apellidoMaterno].filter(Boolean).join(' ') || u.userName || '',
      rol: u.rolNombre || String(u.rol ?? ''),
      correo: u.email || u.userName || '',
      telefono: u.telefono || '',
      empresa: u.nombreCliente || '',
      telefonoSecundario: '',
      identificador: String(u.id ?? ''),
      activo: u.activo !== false,
      ultimoAcceso: u.ultimoLogin || '',
      avatarUrl: u.fotoPerfil || u.imagenPerfil || 'assets/images/users/avatar-2.jpg'
    };
  }

  irCambiarContrasena(): void {
    this.router.navigate(['/perfil/cambiar-contrasena']);
  }

  cerrarSesion(): void {
    this.auth.logout();
  }
}
