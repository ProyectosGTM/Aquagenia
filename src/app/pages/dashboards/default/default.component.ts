import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { moduleEnterAnimation } from 'src/app/core/animations/module-enter.animation';
import {
  transactions, lineColumAreaChart, revenueColumnChart,
  customerRadialBarChart, orderRadialBarChart, growthColumnChart
} from './data';
import { ChartType } from './dashboard.model';

export interface SubItem {
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
  subItems: SubItem[];
}

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
  animations: [moduleEnterAnimation]
})
export class DefaultComponent implements OnInit {

  // ── RADIAL MENU ──
  isOpen = false;
  activeIndex: number | null = null;


  getLabelPosition(index: number): { x: number; y: number } {
    const isSel  = this.activeIndex === index;
    const mid    = this.sectorAngle * index + this.sectorAngle / 2 - Math.PI / 2;
    // radio mayor que el ícono para que quede debajo/afuera
    const r      = isSel
      ? (this.innerRadius + this.outerRadius + 16) / 2 + 30
      : (this.innerRadius + this.outerRadius) / 2 + 28;
    return { x: r * Math.cos(mid), y: r * Math.sin(mid) };
  }
  
  items: RadialItem[] = [
    {
      label: 'Tableros', icon: 'fa-th-large', color: '#3b82f6',
      bg: '#0f1e30', bgSelected: '#1a2f4a', route: '/tableros',
      subItems: [
        { label: 'General',   icon: 'fa-home',       route: '/tableros/general'   },
        { label: 'Resumen',   icon: 'fa-list',        route: '/tableros/resumen'   },
        { label: 'Analytics', icon: 'fa-line-chart',  route: '/tableros/analytics' },
      ]
    },
    {
      label: 'Clientes', icon: 'fa-users', color: '#22c55e',
      bg: '#0f1e30', bgSelected: '#1a3020', route: '/clientes',
      subItems: [
        { label: 'Lista', icon: 'fa-list-ul', route: '/clientes/lista' },
        { label: 'Nuevo', icon: 'fa-plus',    route: '/clientes/nuevo' },
      ]
    },
    {
      label: 'Usuarios', icon: 'fa-user', color: '#06b6d4',
      bg: '#0f1e30', bgSelected: '#0f2a30', route: '/usuarios',
      subItems: [
        { label: 'Lista',    icon: 'fa-list-ul', route: '/usuarios/lista'    },
        { label: 'Roles',    icon: 'fa-shield',  route: '/usuarios/roles'    },
        { label: 'Permisos', icon: 'fa-key',     route: '/usuarios/permisos' },
      ]
    },
    {
      label: 'Módulos', icon: 'fa-puzzle-piece', color: '#a855f7',
      bg: '#0f1e30', bgSelected: '#2a1a40', route: '/modulos',
      subItems: [
        { label: 'Lista', icon: 'fa-list-ul', route: '/modulos/lista' },
        { label: 'Nuevo', icon: 'fa-plus',    route: '/modulos/nuevo' },
      ]
    },
    {
      label: 'Bitácora', icon: 'fa-clipboard', color: '#f97316',
      bg: '#0f1e30', bgSelected: '#3a1f0a', route: '/bitacora',
      subItems: [
        { label: 'Historial', icon: 'fa-history',  route: '/bitacora/historial' },
        { label: 'Eventos',   icon: 'fa-calendar', route: '/bitacora/eventos'   },
      ]
    },
    {
      label: 'Diagrama', icon: 'fa-sitemap', color: '#ef4444',
      bg: '#0f1e30', bgSelected: '#3a1010', route: '/diagrama',
      subItems: [
        { label: 'Ver',    icon: 'fa-eye',  route: '/diagrama/ver'    },
        { label: 'Editar', icon: 'fa-edit', route: '/diagrama/editar' },
      ]
    },
    {
      label: 'Monitoreo', icon: 'fa-heartbeat', color: '#e0e215',
      bg: '#0f1e30', bgSelected: '#2a2a08', route: '/monitoreo',
      subItems: [
        { label: 'Tiempo real', icon: 'fa-clock-o', route: '/monitoreo/realtime' },
        { label: 'Alertas',     icon: 'fa-bell',    route: '/monitoreo/alertas'  },
      ]
    },
    {
      label: 'Mapa', icon: 'fa-map-marker', color: '#14b8a6',
      bg: '#0f1e30', bgSelected: '#0a2a28', route: '/mapa',
      subItems: [
        { label: 'Ver mapa',   icon: 'fa-map',     route: '/mapa/ver'        },
        { label: 'Estaciones', icon: 'fa-map-pin', route: '/mapa/estaciones' },
      ]
    },
    {
      label: 'Transacciones', icon: 'fa-exchange', color: '#60a5fa',
      bg: '#0f1e30', bgSelected: '#1a2a4a', route: '/transacciones',
      subItems: [
        { label: 'Lista', icon: 'fa-list-ul', route: '/transacciones/lista' },
        { label: 'Nueva', icon: 'fa-plus',    route: '/transacciones/nueva' },
      ]
    },
    {
      label: 'Reportes', icon: 'fa-bar-chart', color: '#c084fc',
      bg: '#0f1e30', bgSelected: '#2a1a40', route: '/reportes',
      subItems: [
        { label: 'Mensuales', icon: 'fa-calendar', route: '/reportes/mensuales' },
        { label: 'Anuales',   icon: 'fa-calendar', route: '/reportes/anuales'   },
      ]
    },
  ];

  private outerRadius    = 170;
  private innerRadius    = 64;
  private subInnerRadius = 182;
  private subOuterRadius = 260;
  private gap            = 0.05;
  private subGap         = 0.03;

  get sectorAngle(): number {
    return (2 * Math.PI) / this.items.length;
  }

  // ── DASHBOARD DATA ──
  presionActual = 5.4;

  caudal = [
    { hora: '00', valor: 980  }, { hora: '02', valor: 870  },
    { hora: '04', valor: 760  }, { hora: '06', valor: 900  },
    { hora: '08', valor: 1100 }, { hora: '10', valor: 1300 },
    { hora: '12', valor: 1248 }, { hora: '14', valor: 1180 },
    { hora: '16', valor: 1320 }, { hora: '18', valor: 1250 },
    { hora: '20', valor: 1100 }, { hora: '22', valor: 990  },
  ];

  ph = [
    { hora: '00', valor: 7.1 }, { hora: '02', valor: 7.0 },
    { hora: '04', valor: 6.9 }, { hora: '06', valor: 7.2 },
    { hora: '08', valor: 7.3 }, { hora: '10', valor: 7.2 },
    { hora: '12', valor: 7.2 }, { hora: '14', valor: 7.4 },
    { hora: '16', valor: 7.3 }, { hora: '18', valor: 7.1 },
    { hora: '20', valor: 7.0 }, { hora: '22', valor: 7.2 },
  ];

  alertas = [
    { hora: '00', valor: 0 }, { hora: '02', valor: 1 },
    { hora: '04', valor: 0 }, { hora: '06', valor: 2 },
    { hora: '08', valor: 1 }, { hora: '10', valor: 0 },
    { hora: '12', valor: 3 }, { hora: '14', valor: 2 },
    { hora: '16', valor: 1 }, { hora: '18', valor: 3 },
    { hora: '20', valor: 2 }, { hora: '22', valor: 3 },
  ];

  estaciones = [
    { hora: '00', valor: 8  }, { hora: '02', valor: 8  },
    { hora: '04', valor: 9  }, { hora: '06', valor: 10 },
    { hora: '08', valor: 11 }, { hora: '10', valor: 12 },
    { hora: '12', valor: 12 }, { hora: '14', valor: 12 },
    { hora: '16', valor: 12 }, { hora: '18', valor: 12 },
    { hora: '20', valor: 11 }, { hora: '22', valor: 12 },
  ];

  caudalChart = [
    { hora: '00:00', caudal: 980,  presion: 4.2 },
    { hora: '02:00', caudal: 870,  presion: 3.9 },
    { hora: '04:00', caudal: 760,  presion: 3.5 },
    { hora: '06:00', caudal: 900,  presion: 4.1 },
    { hora: '08:00', caudal: 1100, presion: 5.0 },
    { hora: '10:00', caudal: 1300, presion: 5.8 },
    { hora: '12:00', caudal: 1248, presion: 5.4 },
    { hora: '14:00', caudal: 1180, presion: 5.2 },
    { hora: '16:00', caudal: 1320, presion: 6.0 },
    { hora: '18:00', caudal: 1250, presion: 5.5 },
    { hora: '20:00', caudal: 1100, presion: 4.9 },
    { hora: '22:00', caudal: 990,  presion: 4.4 },
  ];

  phEstaciones  = [7.2, 6.8, 7.5, 8.1, 7.0, 6.9];

  estadoEstaciones = [
    { estado: 'Activas',   cantidad: 8 },
    { estado: 'Alerta',    cantidad: 3 },
    { estado: 'Inactivas', cantidad: 1 },
  ];

  registros = [
    { estacion: 'Est. Norte',    hora: '13:42', caudal: 320, presion: 5.2, ph: 7.1, cloro: 0.8, oxigeno: 8.2, estatus: 'Normal'  },
    { estacion: 'Est. Sur',      hora: '13:40', caudal: 280, presion: 4.9, ph: 8.9, cloro: 0.6, oxigeno: 7.8, estatus: 'Alerta'  },
    { estacion: 'Est. Centro',   hora: '13:38', caudal: 310, presion: 5.5, ph: 7.2, cloro: 0.9, oxigeno: 8.5, estatus: 'Normal'  },
    { estacion: 'Est. Oriente',  hora: '13:35', caudal: 190, presion: 9.8, ph: 7.0, cloro: 0.7, oxigeno: 8.0, estatus: 'Crítico' },
    { estacion: 'Est. Poniente', hora: '13:33', caudal: 148, presion: 4.1, ph: 7.3, cloro: 1.0, oxigeno: 8.8, estatus: 'Normal'  },
    { estacion: 'Est. Lago',     hora: '13:30', caudal: 220, presion: 5.0, ph: 7.1, cloro: 0.8, oxigeno: 8.3, estatus: 'Normal'  },
    { estacion: 'Est. Volcán',   hora: '13:28', caudal: 300, presion: 4.8, ph: 6.8, cloro: 0.5, oxigeno: 7.5, estatus: 'Alerta'  },
    { estacion: 'Est. Sierra',   hora: '13:25', caudal: 260, presion: 5.3, ph: 7.4, cloro: 0.9, oxigeno: 8.6, estatus: 'Normal'  },
  ];

  // ── RADIAL MENU METHODS ──
  constructor(private router: Router) {}

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) this.activeIndex = null;
  }

  selectItem(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  selectSub(subIndex: number): void {
    if (this.activeIndex === null) return;
    const sub = this.getSubItems(this.activeIndex)[subIndex];
    if (sub) {
      setTimeout(() => {
        this.isOpen = false;
        this.activeIndex = null;
        this.router.navigate([sub.route]);
      }, 150);
    }
  }

  getSubItems(index: number): SubItem[] {
    return this.items[index]?.subItems || [];
  }

  getSubBg(index: number): string {
    return this.items[index]?.bgSelected || '#1a2535';
  }

  getSectorPath(index: number): string {
    const isSelected = this.activeIndex === index;
    const angle      = this.sectorAngle;
    const s          = angle * index - Math.PI / 2 + this.gap;
    const e          = angle * (index + 1) - Math.PI / 2 - this.gap;
    const r1         = this.innerRadius;
    const r2         = isSelected ? this.outerRadius + 16 : this.outerRadius;
    const x1 = r2 * Math.cos(s); const y1 = r2 * Math.sin(s);
    const x2 = r2 * Math.cos(e); const y2 = r2 * Math.sin(e);
    const x3 = r1 * Math.cos(e); const y3 = r1 * Math.sin(e);
    const x4 = r1 * Math.cos(s); const y4 = r1 * Math.sin(s);
    const la = angle > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r2} ${r2} 0 ${la} 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 ${la} 0 ${x4} ${y4} Z`;
  }

  getSubSectorPath(parentIndex: number, subIndex: number): string {
    const subs = this.getSubItems(parentIndex);
    const sa   = this.sectorAngle / subs.length;
    const ba   = this.sectorAngle * parentIndex - Math.PI / 2;
    const s    = ba + sa * subIndex + this.subGap;
    const e    = ba + sa * (subIndex + 1) - this.subGap;
    const r1   = this.subInnerRadius;
    const r2   = this.subOuterRadius;
    const x1 = r2 * Math.cos(s); const y1 = r2 * Math.sin(s);
    const x2 = r2 * Math.cos(e); const y2 = r2 * Math.sin(e);
    const x3 = r1 * Math.cos(e); const y3 = r1 * Math.sin(e);
    const x4 = r1 * Math.cos(s); const y4 = r1 * Math.sin(s);
    const la = sa > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r2} ${r2} 0 ${la} 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 ${la} 0 ${x4} ${y4} Z`;
  }

  getSubIconPosition(pi: number, si: number): { x: number; y: number } {
    const subs = this.getSubItems(pi);
    const sa   = this.sectorAngle / subs.length;
    const mid  = this.sectorAngle * pi - Math.PI / 2 + sa * si + sa / 2;
    const r    = (this.subInnerRadius + this.subOuterRadius) / 2 - 10;
    return { x: r * Math.cos(mid), y: r * Math.sin(mid) };
  }

  getSubLabelPosition(pi: number, si: number): { x: number; y: number } {
    const subs = this.getSubItems(pi);
    const sa   = this.sectorAngle / subs.length;
    const mid  = this.sectorAngle * pi - Math.PI / 2 + sa * si + sa / 2;
    const r    = (this.subInnerRadius + this.subOuterRadius) / 2 + 18;
    return { x: r * Math.cos(mid), y: r * Math.sin(mid) };
  }

  getIconPosition(index: number): { x: number; y: number } {
    const isSel = this.activeIndex === index;
    const mid   = this.sectorAngle * index + this.sectorAngle / 2 - Math.PI / 2;
    const r     = isSel
      ? (this.innerRadius + this.outerRadius + 16) / 2
      : (this.innerRadius + this.outerRadius) / 2;
    return { x: r * Math.cos(mid), y: r * Math.sin(mid) };
  }

  // ── DASHBOARD LEGACY ──
  lineColumAreaChart: ChartType;
  revenueColumnChart: ChartType;
  orderRadialBarChart: ChartType;
  customerRadialBarChart: ChartType;
  growthColumnChart: ChartType;
  transactions: any;
  breadCrumbItems: Array<{}>;

  ngOnInit(): void {
    this.fetchData();
    this.breadCrumbItems = [{ label: 'Minible' }, { label: 'Dashboard', active: true }];
  }

  private fetchData(): void {
    this.lineColumAreaChart     = lineColumAreaChart;
    this.revenueColumnChart     = revenueColumnChart;
    this.orderRadialBarChart    = orderRadialBarChart;
    this.customerRadialBarChart = customerRadialBarChart;
    this.growthColumnChart      = growthColumnChart;
    this.transactions           = transactions;
  }
}