import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  DiagramBindField,
  DiagramBindableVariable,
  DiagramElement,
  DiagramElementType,
  DiagramPaletteItem,
} from './diagram-editor.types';

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se';

interface DragState {
  kind: 'move' | 'resize';
  elementId: string;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  origW: number;
  origH: number;
  handle?: ResizeHandle;
}

@Component({
  selector: 'app-diagram-editor',
  templateUrl: './diagram-editor.component.html',
  styleUrls: ['./diagram-editor.component.scss'],
})
export class DiagramEditorComponent implements OnChanges {
  @Input() elements: DiagramElement[] = [];
  @Input() locked = false;
  @Input() listaParametros: any[] = [];
  @Input() paletteImages: string[] = [];
  /** Variables de estación para vincular shapes (Ilustración 7 — vista de variables) */
  @Input() estacionVariables: DiagramBindableVariable[] = [];

  @Output() elementsChange = new EventEmitter<DiagramElement[]>();

  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLElement>;

  selectedId: string | null = null;
  paletteOpen = true;
  activeCategory: string | null = null;
  private dragState: DragState | null = null;
  private nextZ = 1;

  readonly paletteItems: DiagramPaletteItem[] = [
    { type: 'heading', label: 'Título del sitio', icon: 'ti ti-heading', category: 'contenido', defaultWidth: 42, defaultHeight: 8, defaultContent: 'POZO / ESTACIÓN' },
    { type: 'text', label: 'Texto', icon: 'ti ti-letter-t', category: 'contenido', defaultWidth: 28, defaultHeight: 7, defaultContent: 'Descripción del proceso' },
    { type: 'badge', label: 'Etiqueta', icon: 'ti ti-tag', category: 'contenido', defaultWidth: 18, defaultHeight: 6, defaultContent: 'TAG' },
    { type: 'panel-datos', label: 'Panel de datos', icon: 'ti ti-layout-bottombar', category: 'contenido', defaultWidth: 28, defaultHeight: 14, defaultContent: 'Nivel bomba', bindField: 'nivel_actual' },
    { type: 'input', label: 'Campo texto', icon: 'ti ti-forms', category: 'formulario', defaultWidth: 26, defaultHeight: 7, defaultContent: 'Valor' },
    { type: 'textarea', label: 'Área texto', icon: 'ti ti-align-left', category: 'formulario', defaultWidth: 32, defaultHeight: 14, defaultContent: 'Notas del proceso...' },
    { type: 'shape', label: 'Bloque proceso', icon: 'ti ti-square', category: 'proceso', defaultWidth: 22, defaultHeight: 12, defaultContent: 'Etapa' },
    { type: 'caudal', label: 'Sensor caudal vivo', icon: 'ti ti-gauge', category: 'proceso', defaultWidth: 20, defaultHeight: 9, defaultContent: '--' },
  ];

  /** Agua / hidráulica — tuberías, tanques, bombas */
  readonly waterPaletteItems: DiagramPaletteItem[] = [
    { type: 'pipe-h', label: 'Tubería horizontal', icon: 'ti ti-arrows-horizontal', category: 'hidraulica', defaultWidth: 38, defaultHeight: 10, variant: 'normal' },
    { type: 'pipe-v', label: 'Tubería vertical', icon: 'ti ti-arrows-vertical', category: 'hidraulica', defaultWidth: 10, defaultHeight: 30, variant: 'normal' },
    { type: 'pipe-elbow', label: 'Codo / curva', icon: 'ti ti-corner-down-right', category: 'hidraulica', defaultWidth: 18, defaultHeight: 18, defaultContent: 'normal', variant: 'se' },
    { type: 'pipe-tee', label: 'Tee / derivación', icon: 'ti ti-arrows-split-2', category: 'hidraulica', defaultWidth: 20, defaultHeight: 20, variant: 'normal' },
    { type: 'valve', label: 'Válvula / llave', icon: 'ti ti-adjustments-horizontal', category: 'hidraulica', defaultWidth: 16, defaultHeight: 16, defaultContent: 'Válvula', variant: 'open' },
    { type: 'bomba', label: 'Bomba', icon: 'ti ti-engine', category: 'hidraulica', defaultWidth: 22, defaultHeight: 16, defaultContent: 'Bomba', variant: 'on' },
    { type: 'flujo', label: 'Flecha de flujo', icon: 'ti ti-arrow-big-right', category: 'hidraulica', defaultWidth: 16, defaultHeight: 8, variant: 'right' },
    { type: 'pozo', label: 'Pozo (corte)', icon: 'ti ti-cylinder', category: 'hidraulica', defaultWidth: 24, defaultHeight: 32, defaultContent: 'Pozo', variant: '62' },
    { type: 'carcamo', label: 'Cárcamo', icon: 'ti ti-box', category: 'hidraulica', defaultWidth: 28, defaultHeight: 20, defaultContent: 'Cárcamo', variant: '75' },
    { type: 'estanque', label: 'Estanque vertical', icon: 'ti ti-database', category: 'hidraulica', defaultWidth: 16, defaultHeight: 28, defaultContent: 'Estanque', variant: '68' },
    { type: 'cisterna', label: 'Cisterna / depósito', icon: 'ti ti-barrel', category: 'hidraulica', defaultWidth: 32, defaultHeight: 18, defaultContent: 'Cisterna', variant: '70' },
    { type: 'reservorio', label: 'Reservorio', icon: 'ti ti-waves-electricity', category: 'hidraulica', defaultWidth: 38, defaultHeight: 22, defaultContent: 'Reservorio', variant: '80' },
  ];

  /** Instrumentación de campo */
  readonly instrumentPaletteItems: DiagramPaletteItem[] = [
    { type: 'caudalimetro', label: 'Caudalímetro', icon: 'ti ti-topology-ring', category: 'instrumentacion', defaultWidth: 22, defaultHeight: 12, defaultContent: 'Q', bindField: 'caudal' },
    { type: 'manometro', label: 'Manómetro', icon: 'ti ti-gauge', category: 'instrumentacion', defaultWidth: 12, defaultHeight: 14, defaultContent: 'P', variant: '55' },
    { type: 'medidor', label: 'Medidor / contador', icon: 'ti ti-chart-dots', category: 'instrumentacion', defaultWidth: 18, defaultHeight: 11, defaultContent: '--', bindField: 'gasto_acumulado' },
    { type: 'sensor-nivel', label: 'Sensor de nivel', icon: 'ti ti-ruler-measure', category: 'instrumentacion', defaultWidth: 16, defaultHeight: 10, defaultContent: '--', bindField: 'nivel_actual' },
    { type: 'sensor-ph', label: 'Sensor PH', icon: 'ti ti-test-pipe', category: 'instrumentacion', defaultWidth: 16, defaultHeight: 10, defaultContent: '--', bindField: 'ph_carcamo' },
    { type: 'sensor-cloro', label: 'Sensor cloro', icon: 'ti ti-flask', category: 'instrumentacion', defaultWidth: 16, defaultHeight: 10, defaultContent: '--', bindField: 'cloro_residual' },
    { type: 'sensor-oxigeno', label: 'Sensor oxígeno', icon: 'ti ti-droplet-half-2', category: 'instrumentacion', defaultWidth: 16, defaultHeight: 10, defaultContent: '--', bindField: 'oxigeno_disuelto' },
    { type: 'plc', label: 'PLC / gabinete', icon: 'ti ti-server', category: 'instrumentacion', defaultWidth: 14, defaultHeight: 18, defaultContent: 'PLC' },
  ];

  /** Widgets de visualización (estilo sinóptico SCADA) */
  readonly vizPaletteItems: DiagramPaletteItem[] = [
    { type: 'widget-valor', label: 'Valor en vivo', icon: 'ti ti-square-number-1', category: 'visualizacion', defaultWidth: 18, defaultHeight: 12, defaultContent: 'Valor', bindField: 'caudal' },
    { type: 'widget-nivel', label: 'Gauge de nivel', icon: 'ti ti-chart-bar', category: 'visualizacion', defaultWidth: 10, defaultHeight: 28, defaultContent: 'Nivel', bindField: 'nivel_actual', variant: '65' },
    { type: 'widget-gauge', label: 'Semi-gauge', icon: 'ti ti-chart-arcs', category: 'visualizacion', defaultWidth: 20, defaultHeight: 16, defaultContent: 'Capacidad', bindField: 'nivel_actual', variant: '72' },
    { type: 'widget-chart', label: 'Gráfico tendencia', icon: 'ti ti-chart-line', category: 'visualizacion', defaultWidth: 36, defaultHeight: 22, defaultContent: 'Tendencia 24h' },
    { type: 'widget-table', label: 'Tabla de lecturas', icon: 'ti ti-table', category: 'visualizacion', defaultWidth: 34, defaultHeight: 24, defaultContent: 'Lecturas' },
  ];

  private readonly backgroundWaterTypes = new Set<DiagramElementType>([
    'pozo', 'estanque', 'carcamo', 'reservorio', 'cisterna',
  ]);

  private readonly fillableTypes = new Set<DiagramElementType>([
    'pozo', 'estanque', 'carcamo', 'reservorio', 'cisterna', 'widget-nivel', 'widget-gauge', 'manometro',
  ]);

  /** Serie mock para widget-chart */
  readonly chartSeries = [42, 48, 45, 55, 62, 58, 70, 68, 74, 71, 80, 76, 82, 78, 85];
  readonly tableRows = [
    { tag: 'Q inst.', valor: '12.4', unidad: 'L/s' },
    { tag: 'Nivel', valor: '68', unidad: '%' },
    { tag: 'PH', valor: '7.2', unidad: '' },
    { tag: 'Cloro', valor: '0.6', unidad: 'mg/L' },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elements'] && this.elements?.length) {
      const maxZ = Math.max(...this.elements.map((e) => e.zIndex), 0);
      this.nextZ = maxZ + 1;
    }
  }

  get categories(): string[] {
    return ['contenido', 'formulario', 'proceso', 'hidraulica', 'instrumentacion', 'visualizacion'];
  }

  get categoryLabel(): Record<string, string> {
    return {
      contenido: 'Contenido',
      formulario: 'Formulario',
      proceso: 'Proceso',
      iconos: 'Iconos',
      hidraulica: 'Agua e hidráulica',
      instrumentacion: 'Instrumentación',
      visualizacion: 'Visualización',
    };
  }

  itemsByCategory(cat: string): DiagramPaletteItem[] {
    if (cat === 'hidraulica') {
      return this.waterPaletteItems;
    }
    if (cat === 'instrumentacion') {
      return this.instrumentPaletteItems;
    }
    if (cat === 'visualizacion') {
      return this.vizPaletteItems;
    }
    return this.paletteItems.filter((p) => p.category === cat);
  }

  isWaterType(type: DiagramElementType): boolean {
    return this.waterPaletteItems.some((p) => p.type === type);
  }

  isInstrumentType(type: DiagramElementType): boolean {
    return this.instrumentPaletteItems.some((p) => p.type === type);
  }

  isVizType(type: DiagramElementType): boolean {
    return this.vizPaletteItems.some((p) => p.type === type) || type === 'panel-datos';
  }

  isFillable(type: DiagramElementType): boolean {
    return this.fillableTypes.has(type);
  }

  isBackgroundElement(el: DiagramElement): boolean {
    return this.backgroundWaterTypes.has(el.type);
  }

  getFillLevel(el: DiagramElement): number {
    const n = parseInt(el.variant ?? '60', 10);
    return Math.max(10, Math.min(95, isNaN(n) ? 60 : n));
  }

  getFlowClass(el: DiagramElement): string {
    if (el.type === 'pipe-elbow') {
      return el.content === 'slow' || el.content === 'fast' ? el.content : 'normal';
    }
    return el.variant === 'slow' || el.variant === 'fast' ? el.variant : 'normal';
  }

  getElbowOrientation(el: DiagramElement): string {
    const v = el.variant;
    return v === 'se' || v === 'sw' || v === 'ne' || v === 'nw' ? v : 'se';
  }

  getElbowPath(el: DiagramElement): string {
    const paths: Record<string, string> = {
      se: 'M 4 50 L 50 50 L 50 96',
      sw: 'M 96 50 L 50 50 L 50 96',
      ne: 'M 4 50 L 50 50 L 50 4',
      nw: 'M 96 50 L 50 50 L 50 4',
    };
    return paths[this.getElbowOrientation(el)];
  }

  onWaterVariantChange(el: DiagramElement): void {
    this.emitChange();
  }

  iconPaletteItems(): DiagramPaletteItem[] {
    return this.paletteImages.map((url, i) => ({
      type: 'image' as DiagramElementType,
      label: `Icono ${i + 1}`,
      icon: 'ti ti-photo',
      category: 'iconos' as const,
      defaultWidth: 12,
      defaultHeight: 12,
      imageUrl: url,
    }));
  }

  get selectedElement(): DiagramElement | undefined {
    return this.elements.find((e) => e.id === this.selectedId);
  }

  trackById(_: number, el: DiagramElement): string {
    return el.id;
  }

  togglePalette(): void {
    this.paletteOpen = !this.paletteOpen;
  }

  toggleCategory(cat: string): void {
    this.activeCategory = this.activeCategory === cat ? null : cat;
  }

  onCanvasClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).closest('.diagram-el')) {
      return;
    }
    this.selectedId = null;
  }

  selectElement(id: string, event: MouseEvent): void {
    event.stopPropagation();
    if (this.locked) {
      return;
    }
    this.selectedId = id;
    this.bringToFront(id);
  }

  bringToFront(id: string): void {
    const el = this.elements.find((e) => e.id === id);
    if (!el) {
      return;
    }
    el.zIndex = this.nextZ++;
    this.emitChange();
  }

  deleteSelected(): void {
    if (!this.selectedId || this.locked) {
      return;
    }
    this.elements = this.elements.filter((e) => e.id !== this.selectedId);
    this.selectedId = null;
    this.emitChange();
  }

  duplicateSelected(): void {
    const src = this.selectedElement;
    if (!src || this.locked) {
      return;
    }
    const copy: DiagramElement = {
      ...src,
      id: this.newId(),
      x: Math.min(src.x + 3, 92),
      y: Math.min(src.y + 3, 92),
      zIndex: this.nextZ++,
    };
    this.elements = [...this.elements, copy];
    this.selectedId = copy.id;
    this.emitChange();
  }

  onLiveSensorDragStart(event: DragEvent, param: { Id: number; Caudal: string }): void {
    this.onPaletteDragStart(event, {
      type: 'caudal',
      label: `Caudal ${param.Id}`,
      icon: 'ti ti-gauge',
      category: 'proceso',
      defaultWidth: 20,
      defaultHeight: 9,
      defaultContent: String(param.Caudal),
      paramId: param.Id,
    });
  }

  onPaletteDragStart(event: DragEvent, item: DiagramPaletteItem): void {
    if (this.locked) {
      event.preventDefault();
      return;
    }
    event.dataTransfer?.setData('application/diagram-palette', JSON.stringify(item));
    event.dataTransfer!.effectAllowed = 'copy';
  }

  onCanvasDragOver(event: DragEvent): void {
    if (this.locked) {
      return;
    }
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'copy';
  }

  onCanvasDrop(event: DragEvent): void {
    if (this.locked) {
      return;
    }
    event.preventDefault();
    const raw = event.dataTransfer?.getData('application/diagram-palette');
    if (!raw) {
      return;
    }
    const item: DiagramPaletteItem = JSON.parse(raw);
    const pos = this.pointerToPercent(event.clientX, event.clientY);
    this.addElement(item, pos.x, pos.y);
  }

  onElementPointerDown(event: PointerEvent, el: DiagramElement): void {
    if (this.locked || event.button !== 0) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, select')) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    this.selectedId = el.id;
    this.bringToFront(el.id);
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);

    this.dragState = {
      kind: 'move',
      elementId: el.id,
      startX: event.clientX,
      startY: event.clientY,
      origX: el.x,
      origY: el.y,
      origW: el.width,
      origH: el.height,
    };
  }

  onResizePointerDown(event: PointerEvent, el: DiagramElement, handle: ResizeHandle): void {
    if (this.locked) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);

    this.dragState = {
      kind: 'resize',
      elementId: el.id,
      startX: event.clientX,
      startY: event.clientY,
      origX: el.x,
      origY: el.y,
      origW: el.width,
      origH: el.height,
      handle,
    };
  }

  @HostListener('document:pointermove', ['$event'])
  onDocumentPointerMove(event: PointerEvent): void {
    if (!this.dragState) {
      return;
    }
    const el = this.elements.find((e) => e.id === this.dragState!.elementId);
    if (!el) {
      return;
    }

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const dx = ((event.clientX - this.dragState.startX) / rect.width) * 100;
    const dy = ((event.clientY - this.dragState.startY) / rect.height) * 100;

    if (this.dragState.kind === 'move') {
      el.x = this.clamp(this.dragState.origX + dx, 0, 100 - el.width);
      el.y = this.clamp(this.dragState.origY + dy, 0, 100 - el.height);
    } else {
      this.applyResize(el, dx, dy);
    }
    this.emitChange();
  }

  @HostListener('document:pointerup')
  onDocumentPointerUp(): void {
    this.dragState = null;
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.locked || !this.selectedId) {
      return;
    }
    if (event.key === 'Delete' || event.key === 'Backspace') {
      const tag = (event.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        return;
      }
      event.preventDefault();
      this.deleteSelected();
    }
  }

  onElementContentChange(el: DiagramElement): void {
    this.emitChange();
  }

  getCaudalValue(el: DiagramElement): string {
    if (!el.paramId || !this.listaParametros?.length) {
      return el.content;
    }
    const param = this.listaParametros.find((p) => p.Id === el.paramId);
    return param?.Caudal ?? el.content;
  }

  isLiveSensorType(type: DiagramElementType): boolean {
    return (
      type === 'caudal' ||
      type === 'sensor-nivel' ||
      type === 'sensor-ph' ||
      type === 'sensor-cloro' ||
      type === 'sensor-oxigeno' ||
      type === 'medidor' ||
      type === 'caudalimetro' ||
      type === 'widget-valor' ||
      type === 'panel-datos' ||
      type === 'widget-nivel' ||
      type === 'widget-gauge'
    );
  }

  getNumericBound(el: DiagramElement): number {
    const raw = this.getBoundValue(el);
    const n = parseFloat(String(raw).replace(/[^\d.-]/g, ''));
    if (!isNaN(n)) {
      return Math.max(0, Math.min(100, n > 100 ? n % 100 : n));
    }
    return this.getFillLevel(el);
  }

  getChartPath(): string {
    const data = this.chartSeries;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const span = Math.max(1, max - min);
    const w = 100;
    const h = 40;
    return data
      .map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / span) * (h - 4) - 2;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }

  getGaugeArc(el: DiagramElement): string {
    const pct = this.getNumericBound(el) / 100;
    const start = Math.PI;
    const end = Math.PI + Math.PI * pct;
    const r = 36;
    const cx = 50;
    const cy = 48;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = pct > 0.5 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  getNeedleRotation(el: DiagramElement): number {
    return -90 + (this.getNumericBound(el) / 100) * 180;
  }

  getBoundValue(el: DiagramElement): string {
    if (el.type === 'caudal' && el.paramId) {
      return this.getCaudalValue(el);
    }
    if (el.bindField && this.estacionVariables?.length) {
      const v = this.estacionVariables.find((x) => x.key === el.bindField);
      if (v != null) {
        return `${v.value}${v.unit ? ' ' + v.unit : ''}`;
      }
    }
    return el.content || '--';
  }

  getBoundLabel(el: DiagramElement): string {
    if (el.bindField && this.estacionVariables?.length) {
      const v = this.estacionVariables.find((x) => x.key === el.bindField);
      if (v) {
        return v.label;
      }
    }
    const defaults: Partial<Record<DiagramElementType, string>> = {
      caudal: 'Caudal',
      'sensor-nivel': 'Nivel',
      'sensor-ph': 'PH',
      'sensor-cloro': 'Cloro',
      'sensor-oxigeno': 'Oxígeno',
      medidor: 'Medidor',
      caudalimetro: 'Caudal',
      manometro: 'Presión',
      'panel-datos': 'Dato',
      'widget-valor': 'Valor',
      'widget-nivel': 'Nivel',
      'widget-gauge': 'Capacidad',
    };
    return defaults[el.type] ?? 'Variable';
  }

  onBindFieldChange(el: DiagramElement): void {
    el.content = this.getBoundValue(el);
    this.emitChange();
  }

  syncCaudalElements(): void {
    let changed = false;
    this.elements.forEach((el) => {
      if (el.type === 'caudal' && el.paramId) {
        const param = this.listaParametros?.find((p) => p.Id === el.paramId);
        if (!param) {
          return;
        }
        const val = String(param.Caudal);
        if (el.content !== val) {
          el.content = val;
          changed = true;
        }
        return;
      }
      if (el.bindField && this.isLiveSensorType(el.type)) {
        const next = this.getBoundValue(el);
        if (el.content !== next) {
          el.content = next;
          changed = true;
        }
      }
    });
    if (changed) {
      this.emitChange();
    }
  }

  private applyResize(el: DiagramElement, dx: number, dy: number): void {
    const s = this.dragState!;
    const minW = 6;
    const minH = 4;

    switch (s.handle) {
      case 'se':
        el.width = this.clamp(s.origW + dx, minW, 100 - s.origX);
        el.height = this.clamp(s.origH + dy, minH, 100 - s.origY);
        break;
      case 'sw':
        el.x = this.clamp(s.origX + dx, 0, s.origX + s.origW - minW);
        el.width = this.clamp(s.origW - dx, minW, 100 - el.x);
        el.height = this.clamp(s.origH + dy, minH, 100 - s.origY);
        break;
      case 'ne':
        el.y = this.clamp(s.origY + dy, 0, s.origY + s.origH - minH);
        el.width = this.clamp(s.origW + dx, minW, 100 - s.origX);
        el.height = this.clamp(s.origH - dy, minH, 100 - el.y);
        break;
      case 'nw':
        el.x = this.clamp(s.origX + dx, 0, s.origX + s.origW - minW);
        el.y = this.clamp(s.origY + dy, 0, s.origY + s.origH - minH);
        el.width = this.clamp(s.origW - dx, minW, 100 - el.x);
        el.height = this.clamp(s.origH - dy, minH, 100 - el.y);
        break;
    }
  }

  private addElement(item: DiagramPaletteItem, x: number, y: number): void {
    const paramId =
      item.paramId ??
      (item.type === 'caudal' && this.listaParametros?.length
        ? this.listaParametros[0].Id
        : undefined);

    const bindField: DiagramBindField | undefined =
      item.bindField ??
      (item.type === 'caudal' ? 'caudal' : undefined);

    const el: DiagramElement = {
      id: this.newId(),
      type: item.type,
      x: this.clamp(x - item.defaultWidth / 2, 0, 100 - item.defaultWidth),
      y: this.clamp(y - item.defaultHeight / 2, 0, 100 - item.defaultHeight),
      width: item.defaultWidth,
      height: item.defaultHeight,
      content:
        item.type === 'caudal'
          ? String(
              this.listaParametros?.find((p) => p.Id === paramId)?.Caudal ??
                item.defaultContent ??
                '--'
            )
          : (item.defaultContent ?? ''),
      imageUrl: item.imageUrl,
      paramId,
      bindField,
      variant: item.variant,
      zIndex: this.backgroundWaterTypes.has(item.type) ? 1 : this.nextZ++,
    };

    if (bindField && this.isLiveSensorType(item.type) && item.type !== 'caudal') {
      el.content = this.getBoundValue(el);
    }

    this.elements = [...this.elements, el];
    this.selectedId = el.id;
    this.emitChange();
  }

  private pointerToPercent(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  }

  private newId(): string {
    return `el-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  private clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, v));
  }

  private emitChange(): void {
    this.elementsChange.emit([...this.elements]);
  }
}
