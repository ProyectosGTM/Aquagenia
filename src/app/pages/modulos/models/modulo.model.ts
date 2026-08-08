/** Payload de creación / actualización de módulo (POST / PUT). */
export interface ModuloRequest {
  nombre: string;
  descripcion: string;
  estatus: number;
}

/** Entidad módulo según API. */
export interface Modulo {
  id: number;
  nombre: string;
  descripcion: string;
  /** 1 = Activo, 0 = Inactivo (u otros valores que defina el backend). */
  estatus: number;
}

/** Body para PATCH /modulos/{id}/estatus */
export interface ModuloEstatusRequest {
  estatus: number;
}
