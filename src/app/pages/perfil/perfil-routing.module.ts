import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { CambiarContrasenaComponent } from './cambiar-contrasena/cambiar-contrasena.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'mi-cuenta',
    pathMatch: 'full'
  },
  {
    path: 'mi-cuenta',
    component: PerfilUsuarioComponent
  },
  {
    path: 'cambiar-contrasena',
    component: CambiarContrasenaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilRoutingModule { }
