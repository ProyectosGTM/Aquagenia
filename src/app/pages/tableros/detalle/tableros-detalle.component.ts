import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { moduleEnterAnimation } from 'src/app/core/animations/module-enter.animation';
import { TablerosMockService } from '../tableros-mock.service';
import { LecturaDetalle, TableroEstacion } from '../tableros.models';

@Component({
  selector: 'app-tableros-detalle',
  templateUrl: './tableros-detalle.component.html',
  styleUrls: ['./tableros-detalle.component.scss'],
  animations: [moduleEnterAnimation],
})
export class TablerosDetalleComponent implements OnInit {
  estaciones: TableroEstacion[] = [];
  estacion?: TableroEstacion;
  estacionId = '';
  historial: LecturaDetalle[] = [];
  tendencia: { arg: string; [key: string]: string | number }[] = [];
  dateFrom: Date = new Date(Date.now() - 29 * 86400000);
  dateTo: Date = new Date();
  palette = ['#166c9f', '#e0e215', 'rgba(22,108,159,0.55)', 'rgba(224,226,21,0.55)', 'rgba(22,108,159,0.35)'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mock: TablerosMockService
  ) {}

  ngOnInit(): void {
    this.mock.getEstaciones().subscribe((list) => (this.estaciones = list));
    this.route.paramMap.subscribe((params) => {
      this.estacionId = params.get('id') || '';
      this.loadEstacion();
    });
  }

  onEstacionChange(e: { value?: string }): void {
    const id = e?.value;
    if (!id || id === this.estacionId) {
      return;
    }
    this.router.navigate(['/tablero/detalle', id]);
  }

  onDateChange(): void {
    this.loadSeries();
  }

  private loadEstacion(): void {
    if (!this.estacionId) {
      return;
    }
    this.mock.getEstacion(this.estacionId).subscribe((est) => {
      this.estacion = est;
      if (!est && this.estaciones.length) {
        this.router.navigate(['/tablero/detalle', this.estaciones[0].id]);
        return;
      }
      this.loadSeries();
    });
  }

  private loadSeries(): void {
    if (!this.estacionId) {
      return;
    }
    this.mock
      .getHistorial(this.estacionId, this.dateFrom, this.dateTo)
      .subscribe((h) => (this.historial = h));
    this.mock
      .getTendenciaMultivariable(this.estacionId, this.dateFrom, this.dateTo)
      .subscribe((t) => (this.tendencia = t));
  }

  gaugeLabel = (arg: { valueText: string }) => `${arg.valueText}%`;

  volver(): void {
    this.router.navigate(['/tablero']);
  }
}
