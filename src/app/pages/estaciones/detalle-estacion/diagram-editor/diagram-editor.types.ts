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
  | 'valve'
  | 'pozo'
  | 'estanque'
  | 'bomba'
  | 'flujo'
  | 'carcamo'
  | 'reservorio';

export interface DiagramPaletteItem {
  type: DiagramElementType;
  label: string;
  icon: string;
  category: 'contenido' | 'formulario' | 'proceso' | 'iconos' | 'hidraulica';
  defaultWidth: number;
  defaultHeight: number;
  defaultContent?: string;
  imageUrl?: string;
  paramId?: number;
  variant?: string;
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
  /** Estado visual: llave open/closed, velocidad de flujo, nivel de agua, etc. */
  variant?: string;
  zIndex: number;
}

export interface DiagramCard {
  title: string;
  isEditable: boolean;
  isTitleEditable: boolean;
  elements: DiagramElement[];
}
