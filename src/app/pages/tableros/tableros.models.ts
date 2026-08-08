export type EstacionEstado = 'activo' | 'inactivo';

export interface TableroEstacion {
  id: string;
  codigo: string | number;
  nombre: string;
  estado: EstacionEstado;
  ubicacion: string;
  lastReading: string;
  position: { lat: number; lng: number };
  volumenDisponible: number;
  capacidadPct: number;
  caudalInstantaneo: number;
  caudalAcumulado: number;
  phCarcamo: number;
  oxigenoDisuelto: number;
}

export interface SeriePunto {
  fecha: string;
  valor: number;
}

export interface CapacidadSerie {
  estacionId: string;
  nombre: string;
  puntos: SeriePunto[];
}

export interface LecturaDetalle {
  fecha: string;
  gastoInstantaneo: number;
  gastoAcumulado: number;
  phCarcamo: number;
  phEnvio: number;
  clarificador: number;
  demandaQuimica: number;
  oxigenoDisuelto: number;
  nitrogenoAmoniacal: number;
  cloroResidual: number;
}

export interface TableroResumen {
  estacionesActivas: number;
  estacionesTotales: number;
  pctOperativas: number;
  caudalTotal: number;
  alertasActivas: number;
}
