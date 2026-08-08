import { Component, OnInit } from '@angular/core';
import { moduleEnterAnimation } from 'src/app/core/animations/module-enter.animation';
import { GridToolbarBase } from 'src/app/core/helpers/grid-toolbar.base';
import { AlarmasMockService } from '../alarmas-mock.service';
import { AlarmaContacto } from '../alarmas.models';

@Component({
  selector: 'app-contactos-alarmas',
  templateUrl: './contactos-alarmas.component.html',
  styleUrls: ['./contactos-alarmas.component.scss'],
  animations: [moduleEnterAnimation],
})
export class ContactosAlarmasComponent extends GridToolbarBase implements OnInit {
  contactos: AlarmaContacto[] = [];
  saveHint = '';

  constructor(private mock: AlarmasMockService) {
    super();
  }

  ngOnInit(): void {
    this.mock.getContactos().subscribe((c) => (this.contactos = c));
  }

  onSaved(): void {
    this.mock.saveContactos(this.contactos).subscribe(() => {
      this.saveHint = 'Contactos guardados';
      setTimeout(() => (this.saveHint = ''), 2500);
    });
  }

  onRowInserted(e: { data: AlarmaContacto }): void {
    if (!e.data.id) {
      e.data.id = Date.now();
    }
    this.onSaved();
  }

  onRowUpdated(): void {
    this.onSaved();
  }

  onRowRemoved(): void {
    this.onSaved();
  }
}
