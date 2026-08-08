import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { moduleEnterAnimation } from 'src/app/core/animations/module-enter.animation';
import { MapStationMarker } from 'src/app/shared/components/estaciones-map-widget/estaciones-map-widget.component';
import { TablerosMockService } from '../tableros-mock.service';
import { CapacidadSerie, TableroEstacion, TableroResumen } from '../tableros.models';

@Component({
  selector: 'app-tableros-general',
  templateUrl: './tableros-general.component.html',
  styleUrls: ['./tableros-general.component.scss'],
  animations: [moduleEnterAnimation],
})
export class TablerosGeneralComponent implements OnInit {
  resumen: TableroResumen = {
    estacionesActivas: 0,
    estacionesTotales: 0,
    pctOperativas: 0,
    caudalTotal: 0,
    alertasActivas: 0,
  };
  estaciones: TableroEstacion[] = [];
  mapStations: MapStationMarker[] = [];
  volumenData: { nombre: string; volumen: number }[] = [];
  capacidadChartData: { fecha: string; [key: string]: string | number }[] = [];
  capacidadSeriesNames: string[] = [];
  palette = ['#166c9f', '#e0e215', 'rgba(22,108,159,0.55)', 'rgba(224,226,21,0.55)', 'rgba(22,108,159,0.35)'];
  /** Altura compartida mapa + gráfica de volumen (mismas cards) */
  mapChartHeight = 420;

  constructor(
    private mock: TablerosMockService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mock.getResumen().subscribe((r) => (this.resumen = r));
    this.mock.getEstaciones().subscribe((list) => {
      this.estaciones = list;
      this.mapStations = list.map((e) => ({
        id: e.id,
        name: e.nombre,
        active: e.estado === 'activo',
        position: e.position,
        lastReading: e.lastReading,
      }));
    });
    this.mock.getVolumenPorEstacion().subscribe((v) => (this.volumenData = v));
    this.mock.getCapacidadSeries(30).subscribe((series) => this.buildCapacidadChart(series));
  }

  private buildCapacidadChart(series: CapacidadSerie[]): void {
    this.capacidadSeriesNames = series.map((s) => s.nombre);
    const byDate = new Map<string, { fecha: string; [key: string]: string | number }>();
    series.forEach((s) => {
      s.puntos.forEach((p) => {
        const row = byDate.get(p.fecha) || { fecha: p.fecha };
        row[s.nombre] = p.valor;
        byDate.set(p.fecha, row);
      });
    });
    this.capacidadChartData = Array.from(byDate.values());
  }

  customizeVolumenLabel = (point: { argumentText: string; valueText: string }) =>
    `${point.argumentText}: ${point.valueText} m³`;

  gaugeLabel = (arg: { valueText: string }) => `${arg.valueText}%`;

  irDetalle(estacion: TableroEstacion | MapStationMarker | { id?: string | number }): void {
    const id = 'id' in estacion ? String(estacion.id) : '';
    if (!id) {
      return;
    }
    this.router.navigate(['/tablero/detalle', id]);
  }

  onPieClick(e: { target?: { argument?: string } }): void {
    const nombre = e?.target?.argument;
    const found = this.estaciones.find((x) => x.nombre === nombre);
    if (found) {
      this.irDetalle(found);
    }
  }

  onMapStation(station: MapStationMarker): void {
    this.irDetalle(station);
  }

  onGridRowClick(e: { data?: TableroEstacion }): void {
    if (e?.data) {
      this.irDetalle(e.data);
    }
  }
}
