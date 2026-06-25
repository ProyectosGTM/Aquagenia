import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { CambiarContrasenaComponent } from './cambiar-contrasena/cambiar-contrasena.component';

@NgModule({
  declarations: [
    PerfilUsuarioComponent,
    CambiarContrasenaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PerfilRoutingModule
  ]
})
export class PerfilModule { }
