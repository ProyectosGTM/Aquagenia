import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-header-datetime',
  template: `
    <span class="page-chip"><i class="ti ti-calendar"></i> {{ fecha }}</span>
    <span class="page-chip"><i class="ti ti-clock"></i> {{ hora }}</span>
  `,
  styles: [`:host { display: contents; }`],
})
export class PageHeaderDatetimeComponent implements OnInit, OnDestroy {
  fecha = '';
  hora = '';

  private intervalId?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.actualizar();
    this.intervalId = setInterval(() => this.actualizar(), 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private actualizar(): void {
    const ahora = new Date();
    this.fecha = this.formatearFecha(ahora);
    this.hora = this.formatearHora(ahora);
  }

  private formatearFecha(fecha: Date): string {
    const partes = new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).formatToParts(fecha);

    const dia = partes.find((p) => p.type === 'day')?.value ?? '';
    const mes = partes.find((p) => p.type === 'month')?.value ?? '';
    const anio = partes.find((p) => p.type === 'year')?.value ?? '';
    const mesCap = mes.charAt(0).toUpperCase() + mes.slice(1).replace('.', '');

    return `${dia} ${mesCap} ${anio}`;
  }

  private formatearHora(fecha: Date): string {
    return new Intl.DateTimeFormat('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
      .format(fecha)
      .toLowerCase();
  }
}
