import { Component, OnInit } from '@angular/core';
import { moduleEnterAnimation } from 'src/app/core/animations/module-enter.animation';
import { GridToolbarBase } from 'src/app/core/helpers/grid-toolbar.base';
import { AlarmasMockService } from '../alarmas-mock.service';
import {
  AlarmaContacto,
  AlarmaFormModel,
  AlarmaHistorico,
  AlarmaSeveridad,
} from '../alarmas.models';

@Component({
  selector: 'app-lista-alarmas',
  templateUrl: './lista-alarmas.component.html',
  styleUrls: ['./lista-alarmas.component.scss'],
  animations: [moduleEnterAnimation],
})
export class ListaAlarmasComponent extends GridToolbarBase implements OnInit {
  alarmas: AlarmaHistorico[] = [];
  dateFrom: Date = new Date(Date.now() - 29 * 86400000);
  dateTo: Date = new Date();

  popupVisible = false;
  wizardStep = 1;
  detalleVisible = false;
  alarmaDetalle?: AlarmaHistorico;

  estaciones: { id: string; nombre: string }[] = [];
  variables: string[] = [];
  contactos: AlarmaContacto[] = [];

  form: AlarmaFormModel = this.emptyForm();

  severidadItems = [
    { value: 1 as AlarmaSeveridad, text: '1 — Baja' },
    { value: 2 as AlarmaSeveridad, text: '2 — Media baja' },
    { value: 3 as AlarmaSeveridad, text: '3 — Media' },
    { value: 4 as AlarmaSeveridad, text: '4 — Alta' },
    { value: 5 as AlarmaSeveridad, text: '5 — Crítica' },
  ];

  condicionItems = [
    { value: 'mayor', text: 'Mayor que' },
    { value: 'menor', text: 'Menor que' },
    { value: 'igual', text: 'Igual a' },
    { value: 'rango', text: 'Fuera de rango' },
  ];

  constructor(private mock: AlarmasMockService) {
    super();
  }

  ngOnInit(): void {
    this.loadAlarmas();
    this.mock.getEstaciones().subscribe((e) => (this.estaciones = e));
    this.mock.getVariables().subscribe((v) => (this.variables = v));
    this.mock.getContactos().subscribe((c) => (this.contactos = c));
  }

  loadAlarmas(): void {
    this.mock.getAlarmas(this.dateFrom, this.dateTo).subscribe((list) => (this.alarmas = list));
  }

  onDateChange(): void {
    this.loadAlarmas();
  }

  abrirWizard(): void {
    this.form = this.emptyForm();
    this.wizardStep = 1;
    this.popupVisible = true;
  }

  cerrarWizard(): void {
    this.popupVisible = false;
  }

  nextStep(): void {
    if (this.wizardStep < 3) {
      this.wizardStep++;
    }
  }

  prevStep(): void {
    if (this.wizardStep > 1) {
      this.wizardStep--;
    }
  }

  get canNext(): boolean {
    if (this.wizardStep === 1) {
      return !!this.form.nombre?.trim();
    }
    if (this.wizardStep === 2) {
      return !!this.form.estacionId && !!this.form.variable && this.form.umbral != null;
    }
    return true;
  }

  guardarAlarma(): void {
    this.mock.crearAlarma(this.form).subscribe(() => {
      this.popupVisible = false;
      this.loadAlarmas();
    });
  }

  verDetalle(row: AlarmaHistorico): void {
    this.alarmaDetalle = row;
    this.detalleVisible = true;
  }

  onToolbarPreparing(e: { toolbarOptions: { items: any[] } }): void {
    e.toolbarOptions.items.unshift({
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'plus',
        text: 'Nueva alarma',
        onClick: () => this.abrirWizard(),
      },
    });
  }

  private emptyForm(): AlarmaFormModel {
    return {
      nombre: '',
      descripcion: '',
      severidad: 3,
      activa: true,
      generaNotificacion: true,
      estacionId: '',
      variable: '',
      condicion: 'mayor',
      umbral: 0,
      contactosIds: [],
    };
  }
}
