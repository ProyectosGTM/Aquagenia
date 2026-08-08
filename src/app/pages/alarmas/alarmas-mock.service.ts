import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AlarmaContacto, AlarmaFormModel, AlarmaHistorico } from './alarmas.models';

@Injectable({ providedIn: 'root' })
export class AlarmasMockService {
  private nextId = 20;
  private nextContactoId = 10;

  private contactos: AlarmaContacto[] = [
    { id: 1, nombre: 'Ana García', correo: 'ana.garcia@aquagenia.com', telefono: '33 1000 1001', comentario: 'Operaciones' },
    { id: 2, nombre: 'Carlos Ruiz', correo: 'carlos.ruiz@aquagenia.com', telefono: '33 1000 1002', comentario: 'Supervisor' },
    { id: 3, nombre: 'María López', correo: 'maria.lopez@aquagenia.com', telefono: '33 1000 1003', comentario: 'Calidad' },
    { id: 4, nombre: 'Luis Pérez', correo: 'luis.perez@aquagenia.com', telefono: '33 1000 1004', comentario: 'Mantenimiento' },
    { id: 5, nombre: 'Sofía Méndez', correo: 'sofia.mendez@aquagenia.com', telefono: '33 1000 1005', comentario: 'Guardia' },
  ];

  private readonly estaciones = [
    { id: 'santin', nombre: 'Santín' },
    { id: 'chapala', nombre: 'Chapala Ajijic' },
    { id: 'patria', nombre: 'Combo Patria' },
  ];

  private readonly variables = [
    'gastoInstantaneo',
    'phCarcamo',
    'oxigenoDisuelto',
    'nivel_actual',
    'cloroResidual',
  ];

  private alarmas: AlarmaHistorico[] = this.buildHistorico();

  getAlarmas(from?: Date, to?: Date): Observable<AlarmaHistorico[]> {
    let list = [...this.alarmas];
    if (from || to) {
      list = list.filter((a) => {
        const d = this.parseFecha(a.fecha);
        if (from && d < from) return false;
        if (to) {
          const end = new Date(to);
          end.setHours(23, 59, 59, 999);
          if (d > end) return false;
        }
        return true;
      });
    }
    return of(list);
  }

  getAlarma(id: number): Observable<AlarmaHistorico | undefined> {
    return of(this.alarmas.find((a) => a.id === id));
  }

  crearAlarma(form: AlarmaFormModel): Observable<AlarmaHistorico> {
    const est = this.estaciones.find((e) => e.id === form.estacionId);
    const created: AlarmaHistorico = {
      id: this.nextId++,
      nombre: form.nombre,
      descripcion: form.descripcion,
      fecha: this.formatFecha(new Date()),
      tipo: 'Configurada',
      estacionId: form.estacionId,
      estacionNombre: est?.nombre ?? form.estacionId,
      variable: form.variable,
      condicion: form.condicion,
      umbral: form.umbral,
      severidad: form.severidad,
      activa: form.activa,
      generaNotificacion: form.generaNotificacion,
      notificacionEnviada: false,
      contactosIds: [...(form.contactosIds || [])],
    };
    this.alarmas = [created, ...this.alarmas];
    return of(created);
  }

  getContactos(): Observable<AlarmaContacto[]> {
    return of([...this.contactos]);
  }

  saveContactos(list: AlarmaContacto[]): Observable<AlarmaContacto[]> {
    this.contactos = list.map((c, i) => ({
      ...c,
      id: c.id || this.nextContactoId + i,
    }));
    this.nextContactoId = Math.max(...this.contactos.map((c) => c.id), this.nextContactoId) + 1;
    return of([...this.contactos]);
  }

  getEstaciones(): Observable<{ id: string; nombre: string }[]> {
    return of([...this.estaciones]);
  }

  getVariables(): Observable<string[]> {
    return of([...this.variables]);
  }

  private buildHistorico(): AlarmaHistorico[] {
    const rows: AlarmaHistorico[] = [];
    const now = Date.now();
    const nombres = [
      'Alto caudal',
      'PH fuera de rango',
      'Bajo oxígeno',
      'Nivel crítico',
      'Cloro residual bajo',
      'Estación sin datos',
      'Umbral de presión',
    ];
    for (let i = 0; i < 14; i++) {
      const est = this.estaciones[i % this.estaciones.length];
      const d = new Date(now - i * 1.7 * 86400000 - (i % 5) * 3600000);
      const sev = ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5;
      rows.push({
        id: i + 1,
        nombre: nombres[i % nombres.length],
        descripcion: `Evento detectado en ${est.nombre}`,
        fecha: this.formatFecha(d),
        tipo: i % 3 === 0 ? 'Automática' : 'Umbral',
        estacionId: est.id,
        estacionNombre: est.nombre,
        variable: this.variables[i % this.variables.length],
        condicion: i % 2 === 0 ? 'mayor' : 'menor',
        umbral: 10 + i * 1.5,
        severidad: sev,
        activa: i % 4 !== 0,
        generaNotificacion: i % 2 === 0,
        notificacionEnviada: i % 2 === 0 && i % 3 !== 0,
        contactosIds: [1, 2].slice(0, (i % 2) + 1),
      });
    }
    return rows;
  }

  private formatFecha(d: Date): string {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${d.getFullYear()} ${hh}:${mi}`;
  }

  private parseFecha(value: string): Date {
    const [datePart, timePart] = value.split(' ');
    const [dd, mm, yyyy] = datePart.split('/').map(Number);
    const [hh, mi] = (timePart || '00:00').split(':').map(Number);
    return new Date(yyyy, (mm || 1) - 1, dd || 1, hh || 0, mi || 0);
  }
}
