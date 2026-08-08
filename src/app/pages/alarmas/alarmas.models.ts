export type AlarmaSeveridad = 1 | 2 | 3 | 4 | 5;
export type AlarmaCondicion = 'mayor' | 'menor' | 'igual' | 'rango';

export interface AlarmaContacto {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  comentario: string;
}

export interface AlarmaHistorico {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  tipo: string;
  estacionId: string;
  estacionNombre: string;
  variable: string;
  condicion: AlarmaCondicion;
  umbral: number;
  severidad: AlarmaSeveridad;
  activa: boolean;
  generaNotificacion: boolean;
  notificacionEnviada: boolean;
  contactosIds: number[];
}

export interface AlarmaFormModel {
  nombre: string;
  descripcion: string;
  severidad: AlarmaSeveridad;
  activa: boolean;
  generaNotificacion: boolean;
  estacionId: string;
  variable: string;
  condicion: AlarmaCondicion;
  umbral: number;
  contactosIds: number[];
}
