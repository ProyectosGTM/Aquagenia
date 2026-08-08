import { Component } from '@angular/core';
import { Router } from '@angular/router';

export interface RadialSubItem {
  label: string;
  icon: string;
  route: string;
}

export interface RadialItem {
  label: string;
  icon: string;
  color: string;
  bg: string;
  bgSelected: string;
  route: string;
  subItems: RadialSubItem[];
}

@Component({
  selector: 'app-radial-hub',
  templateUrl: './radial-hub.component.html',
  styleUrls: ['./radial-hub.component.scss'],
})
export class RadialHubComponent {
  isOpen = false;
  activeIndex: number | null = null;

  items: RadialItem[] = [
    {
      label: 'Tableros', icon: 'fa-th-large', color: '#3b82f6',
      bg: 'rgba(14, 18, 28, 0.82)', bgSelected: 'rgba(30, 48, 78, 0.92)', route: '/tablero',
      subItems: [
        { label: 'General', icon: 'fa-home', route: '/tablero' },
        { label: 'Detalle', icon: 'fa-list', route: '/tablero/detalle/chapala' },
      ],
    },
    {
      label: 'Clientes', icon: 'fa-users', color: '#22c55e',
      bg: 'rgba(14, 18, 28, 0.82)', bgSelected: 'rgba(24, 52, 36, 0.92)', route: '/clientes',
      subItems: [
        { label: 'Lista', icon: 'fa-list-ul', route: '/clientes/lista-clientes' },
      ],
    },
    {
      label: 'Usuarios', icon: 'fa-user', color: '#06b6d4',
      bg: 'rgba(14, 18, 28, 0.82)', bgSelected: 'rgba(18, 48, 56, 0.92)', route: '/usuarios',
      subItems: [
        { label: 'Lista', icon: 'fa-list-ul', route: '/usuarios/lista-usuarios' },
        { label: 'Roles', icon: 'fa-shield', route: '/roles/lista-roles' },
        { label: 'Permisos', icon: 'fa-key', route: '/permisos/lista-permisos' },
      ],
    },
    {
      label: 'Módulos', icon: 'fa-puzzle-piece', color: '#a855f7',
      bg: 'rgba(14, 18, 28, 0.82)', bgSelected: 'rgba(42, 28, 64, 0.92)', route: '/modulos',
      subItems: [
        { label: 'Lista', icon: 'fa-list-ul', route: '/modulos/lista-modulos' },
      ],
    },
    {
      label: 'Alarmas', icon: 'fa-bell', color: '#f97316',
      bg: 'rgba(14, 18, 28, 0.82)', bgSelected: 'rgba(56, 32, 16, 0.92)', route: '/alarmas',
      subItems: [
        { label: 'Histórico', icon: 'fa-history', route: '/alarmas/lista-alarmas' },
        { label: 'Contactos', icon: 'fa-address-book', route: '/alarmas/contactos-alarmas' },
      ],
    },
    {
      label: 'Diagrama', icon: 'fa-sitemap', color: '#ef4444',
      bg: 'rgba(14, 18, 28, 0.82)', bgSelected: 'rgba(56, 22, 22, 0.92)', route: '/diagrama',
      subItems: [
        { label: 'Generador', icon: 'fa-edit', route: '/diagrama/generador-diagrama' },
      ],
    },
    {
      label: 'Monitoreo', icon: 'fa-heartbeat', color: '#e0e215',
      bg: 'rgba(14, 18, 28, 0.82)', bgSelected: 'rgba(48, 48, 16, 0.92)', route: '/estaciones',
      subItems: [
        { label: 'Mapa', icon: 'fa-map', route: '/estaciones/lista-estaciones' },
        { label: 'Detalle', icon: 'fa-eye', route: '/estaciones/detalle-estaciones' },
      ],
    },
    {
      label: 'Mapa', icon: 'fa-map-marker', color: '#14b8a6',
      bg: 'rgba(14, 18, 28, 0.82)', bgSelected: 'rgba(16, 48, 44, 0.92)', route: '/estaciones',
      subItems: [
        { label: 'Estaciones', icon: 'fa-map-pin', route: '/estaciones/lista-estaciones' },
      ],
    },
  ];

  private outerRadius = 172;
  private innerRadius = 64;
  private subInner0 = 184;
  private subOuter0 = 258;
  private subLayerGap = 6;
  private gap = 0.014;

  /** Círculo de ícono (un poco más chico para que respire en el wedge) */
  readonly iconR = 13.5;
  readonly iconRSelected = 14.5;

  constructor(private router: Router) {}

  get sectorAngle(): number {
    return (2 * Math.PI) / this.items.length;
  }

  private sectorMidAngle(index: number): number {
    return this.sectorAngle * index + this.sectorAngle / 2 - Math.PI / 2;
  }

  private sectorOuter(index: number): number {
    return this.activeIndex === index ? this.outerRadius + 5 : this.outerRadius;
  }

  /**
   * Centro del bloque icono+texto en el medio del wedge.
   * Sin rotar: icono arriba y texto abajo en coordenadas de pantalla.
   */
  contentTransform(index: number): string {
    const mid = this.sectorMidAngle(index);
    const r = (this.innerRadius + this.sectorOuter(index)) / 2 - 2;
    const x = r * Math.cos(mid);
    const y = r * Math.sin(mid);
    return `translate(${x}, ${y})`;
  }

  subContentTransform(parentIndex: number, subIndex: number): string {
    const slot = this.subSlot(parentIndex, subIndex);
    const mid = this.sectorMidAngle(slot);
    const { r1, r2 } = this.layerRadii(this.stackIndex(subIndex));
    const r = (r1 + r2) / 2 - 2;
    const x = r * Math.cos(mid);
    const y = r * Math.sin(mid);
    return `translate(${x}, ${y})`;
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.activeIndex = null;
    }
  }

  selectItem(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  selectSub(subIndex: number): void {
    if (this.activeIndex === null) {
      return;
    }
    const sub = this.getSubItems(this.activeIndex)[subIndex];
    if (!sub) {
      return;
    }
    setTimeout(() => {
      this.isOpen = false;
      this.activeIndex = null;
      this.router.navigateByUrl(sub.route);
    }, 180);
  }

  getSubItems(index: number): RadialSubItem[] {
    return this.items[index]?.subItems || [];
  }

  getSectorPath(index: number): string {
    const angle = this.sectorAngle;
    const s = angle * index - Math.PI / 2 + this.gap;
    const e = angle * (index + 1) - Math.PI / 2 - this.gap;
    return this.donutSlice(s, e, this.innerRadius, this.sectorOuter(index), angle);
  }

  private subSlot(parentIndex: number, subIndex: number): number {
    return (parentIndex + subIndex) % this.items.length;
  }

  private stackIndex(subIndex: number): number {
    return Math.floor(subIndex / this.items.length);
  }

  private layerRadii(stack: number): { r1: number; r2: number } {
    const h = this.subOuter0 - this.subInner0;
    const r1 = this.subInner0 + stack * (h + this.subLayerGap);
    const r2 = r1 + h;
    return { r1, r2 };
  }

  getSubSectorPath(parentIndex: number, subIndex: number): string {
    const slot = this.subSlot(parentIndex, subIndex);
    const angle = this.sectorAngle;
    const s = angle * slot - Math.PI / 2 + this.gap;
    const e = angle * (slot + 1) - Math.PI / 2 - this.gap;
    const { r1, r2 } = this.layerRadii(this.stackIndex(subIndex));
    return this.donutSlice(s, e, r1, r2, angle);
  }

  private donutSlice(s: number, e: number, r1: number, r2: number, sweepHint: number): string {
    const x1 = r2 * Math.cos(s);
    const y1 = r2 * Math.sin(s);
    const x2 = r2 * Math.cos(e);
    const y2 = r2 * Math.sin(e);
    const x3 = r1 * Math.cos(e);
    const y3 = r1 * Math.sin(e);
    const x4 = r1 * Math.cos(s);
    const y4 = r1 * Math.sin(s);
    const la = sweepHint > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r2} ${r2} 0 ${la} 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 ${la} 0 ${x4} ${y4} Z`;
  }
}
