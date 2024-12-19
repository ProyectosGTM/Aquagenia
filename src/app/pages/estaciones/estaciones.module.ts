import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstacionesRoutingModule } from './estaciones-routing.module';
import { ListaEstacionesComponent } from './lista-estaciones/lista-estaciones.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { DetalleEstacionComponent } from './detalle-estacion/detalle-estacion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DxDataGridModule, DxDiagramModule } from 'devextreme-angular';


@NgModule({
  declarations: [ListaEstacionesComponent, DetalleEstacionComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    EstacionesRoutingModule,
    GoogleMapsModule,
    DxDataGridModule,
    DxDiagramModule,

    MatCardModule,
    DragDropModule
  ],
})
export class EstacionesModule { }
