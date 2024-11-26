import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DxDiagramComponent } from 'devextreme-angular';
import { Employee, Service } from './app.service';

@Component({
  selector: 'app-diagramas',
  templateUrl: './diagramas.component.html',
  styleUrls: ['./diagramas.component.scss'],
  providers: [Service],
})
export class DiagramasComponent implements OnInit {
  employees: Employee[];
  @ViewChild(DxDiagramComponent, { static: false }) diagram: DxDiagramComponent;

  constructor(private service: Service, private http: HttpClient) {
    this.employees = service.getEmployees();
  }

  ngOnInit(): void {
    this.http.get('assets/diagram-employees.json').subscribe({
      next: (data: any) => {
        this.diagram.instance.import(JSON.stringify(data));
      },
      error: (err) => {
        console.error('Error al cargar el archivo JSON:', err);
      },
    });
  }
}
