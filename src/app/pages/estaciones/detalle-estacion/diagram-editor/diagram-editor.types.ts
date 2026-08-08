export type DiagramElementType =
  | 'image'
  | 'text'
  | 'input'
  | 'textarea'
  | 'badge'
  | 'shape'
  | 'caudal'
  | 'heading'
  | 'pipe-h'
  | 'pipe-v'
  | 'pipe-elbow'
  | 'pipe-tee'
  | 'valve'
  | 'pozo'
  | 'estanque'
  | 'cisterna'
  | 'bomba'
  | 'flujo'
  | 'carcamo'
  | 'reservorio'
  | 'sensor-nivel'
  | 'sensor-ph'
  | 'sensor-cloro'
  | 'sensor-oxigeno'
  | 'medidor'
  | 'caudalimetro'
  | 'manometro'
  | 'plc'
  | 'panel-datos'
  | 'widget-valor'
  | 'widget-chart'
  | 'widget-table'
  | 'widget-gauge'
  | 'widget-nivel';

export type DiagramCategory =
  | 'contenido'
  | 'formulario'
  | 'proceso'
  | 'iconos'
  | 'hidraulica'
  | 'instrumentacion'
  | 'visualizacion';

/** Campo de estación al que se puede vincular un shape */
export type DiagramBindField =
  | 'caudal'
  | 'nivel_actual'
  | 'ph_carcamo'
  | 'ph_envio'
  | 'oxigeno_disuelto'
  | 'cloro_residual'
  | 'gasto_acumulado';

export interface DiagramBindableVariable {
  key: DiagramBindField;
  label: string;
  unit: string;
  value: string | number;
}

export interface DiagramPaletteItem {
  type: DiagramElementType;
  label: string;
  icon: string;
  category: DiagramCategory;
  defaultWidth: number;
  defaultHeight: number;
  defaultContent?: string;
  imageUrl?: string;
  paramId?: number;
  variant?: string;
  bindField?: DiagramBindField;
}

export interface DiagramElement {
  id: string;
  type: DiagramElementType;
  /** Posición y tamaño en % respecto al lienzo */
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  imageUrl?: string;
  paramId?: number;
  /** Variable de estación vinculada (vista de variables del sinóptico) */
  bindField?: DiagramBindField;
  /** Estado visual: llave open/closed, velocidad de flujo, nivel de agua, etc. */
  variant?: string;
  zIndex: number;
}

export interface DiagramCard {
  title: string;
  isEditable: boolean;
  isTitleEditable: boolean;
  elements: DiagramElement[];
  /** Estación a la que pertenece el diagrama */
  estacionId?: string;
}
