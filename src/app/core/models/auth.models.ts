/** Perfil autenticado tal como lo expone GET /login/me */
export interface AuthUser {
  id?: number | string;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  nombreCompleto?: string;
  userName?: string;
  email?: string;
  telefono?: string;
  rol?: number | string;
  rolNombre?: string;
  permisos?: Array<string | number | { idPermiso?: string | number; [key: string]: unknown }>;
  fotoPerfil?: string;
  imagenPerfil?: string;
  logo?: string;
  idCliente?: number | string;
  nombreCliente?: string;
  apellidoPaternoCliente?: string;
  apellidoMaternoCliente?: string;
  fechaCreacion?: string;
  ultimoLogin?: string;
  activo?: boolean;
  [key: string]: unknown;
}

/** @deprecated Compat con template Minible / Firebase */
export class User {
  id: number;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  email: string;
}

export interface LoginCredentials {
  userName: string;
  password: string;
}

export interface AuthTokens {
  token?: string;
  refreshToken?: string;
}
