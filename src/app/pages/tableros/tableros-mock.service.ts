import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  CapacidadSerie,
  LecturaDetalle,
  TableroEstacion,
  TableroResumen,
} from './tableros.models';

@Injectable({ providedIn: 'root' })
export class TablerosMockService {
  private readonly estaciones: TableroEstacion[] = [
    {
      id: 'santin',
      codigo: 5702,
      nombre: 'Santín',
      estado: 'activo',
      ubicacion: 'CDMX',
      lastReading: this.hoursAgo(0.4),
      position: { lat: 19.4326, lng: -99.1332 },
      volumenDisponible: 1840,
      capacidadPct: 78,
      caudalInstantaneo: 12.4,
      caudalAcumulado: 302916.78,
      phCarcamo: 7.2,
      oxigenoDisuelto: 5.8,
    },
    {
      id: 'chapala',
      codigo: 1403,
      nombre: 'Chapala Ajijic',
      estado: 'activo',
      ubicacion: 'Jalisco',
      lastReading: this.hoursAgo(0.2),
      position: { lat: 20.2975, lng: -103.2582 },
      volumenDisponible: 3120,
      capacidadPct: 64,
      caudalInstantaneo: 18.7,
      caudalAcumulado: 451220.12,
      phCarcamo: 7.6,
      oxigenoDisuelto: 6.1,
    },
    {
      id: 'patria',
      codigo: '6215-4071',
      nombre: 'Combo Patria',
      estado: 'activo',
      ubicacion: 'Guadalajara',
      lastReading: this.hoursAgo(1.1),
      position: { lat: 20.6597, lng: -103.3496 },
      volumenDisponible: 960,
      capacidadPct: 42,
      caudalInstantaneo: 8.1,
      caudalAcumulado: 188440.55,
      phCarcamo: 6.9,
      oxigenoDisuelto: 4.9,
    },
    {
      id: 'tonala',
      codigo: 8812,
      nombre: 'Tonalá Norte',
      estado: 'inactivo',
      ubicacion: 'Jalisco',
      lastReading: this.hoursAgo(18),
      position: { lat: 20.6245, lng: -103.2342 },
      volumenDisponible: 420,
      capacidadPct: 18,
      caudalInstantaneo: 0,
      caudalAcumulado: 99210.0,
      phCarcamo: 7.0,
      oxigenoDisuelto: 3.2,
    },
    {
      id: 'zapopan',
      codigo: 3340,
      nombre: 'Zapopan Centro',
      estado: 'activo',
      ubicacion: 'Jalisco',
      lastReading: this.hoursAgo(0.8),
      position: { lat: 20.7214, lng: -103.3918 },
      volumenDisponible: 2210,
      capacidadPct: 71,
      caudalInstantaneo: 14.2,
      caudalAcumulado: 276880.33,
      phCarcamo: 7.4,
      oxigenoDisuelto: 5.5,
    },
  ];

  getResumen(): Observable<TableroResumen> {
    const activas = this.estaciones.filter((e) => e.estado === 'activo').length;
    const totales = this.estaciones.length;
    return of({
      estacionesActivas: activas,
      estacionesTotales: totales,
      pctOperativas: Math.round((activas / totales) * 100),
      caudalTotal: Number(
        this.estaciones
          .filter((e) => e.estado === 'activo')
          .reduce((acc, e) => acc + e.caudalInstantaneo, 0)
          .toFixed(1)
      ),
      alertasActivas: 3,
    });
  }

  getEstaciones(): Observable<TableroEstacion[]> {
    return of([...this.estaciones]);
  }

  getEstacion(id: string): Observable<TableroEstacion | undefined> {
    return of(this.estaciones.find((e) => e.id === id));
  }

  getVolumenPorEstacion(): Observable<{ nombre: string; volumen: number }[]> {
    return of(
      this.estaciones.map((e) => ({
        nombre: e.nombre,
        volumen: e.volumenDisponible,
      }))
    );
  }

  getCapacidadSeries(dias = 30): Observable<CapacidadSerie[]> {
    return of(
      this.estaciones.map((e) => ({
        estacionId: e.id,
        nombre: e.nombre,
        puntos: this.buildSeries(dias, e.capacidadPct, 8),
      }))
    );
  }

  getHistorial(
    estacionId: string,
    from?: Date,
    to?: Date
  ): Observable<LecturaDetalle[]> {
    const estacion = this.estaciones.find((e) => e.id === estacionId);
    if (!estacion) {
      return of([]);
    }
    const end = to ? new Date(to) : new Date();
    const start = from ? new Date(from) : new Date(end.getTime() - 29 * 86400000);
    const days = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1
    );
    const rows: LecturaDetalle[] = [];
    let acumulado = estacion.caudalAcumulado - days * 120;

    for (let i = 0; i < days; i++) {
      const d = new Date(start.getTime() + i * 86400000);
      const gasto = this.jitter(estacion.caudalInstantaneo || 5, 2.5);
      acumulado += gasto * 8;
      rows.push({
        fecha: this.formatDate(d),
        gastoInstantaneo: Number(gasto.toFixed(2)),
        gastoAcumulado: Number(acumulado.toFixed(2)),
        phCarcamo: Number(this.jitter(estacion.phCarcamo, 0.4).toFixed(2)),
        phEnvio: Number(this.jitter(estacion.phCarcamo - 0.3, 0.35).toFixed(2)),
        clarificador: Number(this.jitter(22, 8).toFixed(2)),
        demandaQuimica: Number(this.jitter(15, 6).toFixed(2)),
        oxigenoDisuelto: Number(
          this.jitter(estacion.oxigenoDisuelto, 0.8).toFixed(2)
        ),
        nitrogenoAmoniacal: Number(this.jitter(18, 4).toFixed(2)),
        cloroResidual: Number(this.jitter(0.6, 0.3).toFixed(2)),
      });
    }
    return of(rows.reverse());
  }

  getTendenciaMultivariable(
    estacionId: string,
    from?: Date,
    to?: Date
  ): Observable<{ arg: string; [key: string]: string | number }[]> {
    return new Observable((subscriber) => {
      this.getHistorial(estacionId, from, to).subscribe((rows) => {
        subscriber.next(
          [...rows].reverse().map((r) => ({
            arg: r.fecha,
            phCarcamo: r.phCarcamo,
            phEnvio: r.phEnvio,
            clarificador: r.clarificador,
            demandaQuimica: r.demandaQuimica,
            oxigenoDisuelto: r.oxigenoDisuelto,
          }))
        );
        subscriber.complete();
      });
    });
  }

  private buildSeries(
    days: number,
    base: number,
    amplitude: number
  ): { fecha: string; valor: number }[] {
    const points: { fecha: string; valor: number }[] = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const wave = Math.sin(i / 4) * (amplitude / 2);
      const noise = (Math.random() - 0.5) * amplitude;
      const valor = Math.min(100, Math.max(5, base + wave + noise));
      points.push({ fecha: this.formatDate(d), valor: Number(valor.toFixed(1)) });
    }
    return points;
  }

  private jitter(base: number, amp: number): number {
    return Math.max(0, base + (Math.random() - 0.5) * 2 * amp);
  }

  private hoursAgo(h: number): string {
    const d = new Date(Date.now() - h * 3600000);
    return this.formatDateTime(d);
  }

  private formatDate(d: Date): string {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${d.getFullYear()}`;
  }

  private formatDateTime(d: Date): string {
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${this.formatDate(d)} ${hh}:${mi}`;
  }
}
