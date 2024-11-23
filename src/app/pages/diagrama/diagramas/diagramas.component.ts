import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DxDiagramComponent } from 'devextreme-angular';
import { Employee, Service } from './app.service';

@Component({
  selector: 'app-diagramas',
  templateUrl: './diagramas.component.html',
  styleUrls: ['./diagramas.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [Service],
})
export class DiagramasComponent implements OnInit {
  employees: Employee[]; // Lista de empleados
  @ViewChild(DxDiagramComponent, { static: false }) diagram: DxDiagramComponent;

  constructor(service: Service, private http: HttpClient) {
    // Obtener lista de empleados desde el servicio
    this.employees = service.getEmployees();
  }

  ngOnInit(): void {
    // Cargar el JSON del diagrama
    this.http.get('assets/diagram-employees.json').subscribe({
      next: (data: any) => {
        console.log('Datos cargados:', data);

        // Importar los datos al diagrama
        this.diagram.instance.import(JSON.stringify(data));
      },
      error: (err) => {
        console.error('Error al cargar el archivo JSON:', err);
      },
    });
  }
}
