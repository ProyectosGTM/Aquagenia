import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-estaciones',
  templateUrl: './lista-estaciones.component.html',
  styleUrl: './lista-estaciones.component.scss'
})
export class ListaEstacionesComponent implements OnInit {
  center = { lat: 23.6345, lng: -102.5528 }; // Center of Mexico
  zoom = 5;
  operations = [
    {
      name: 'Santín',
      det: 5702,
      company: 'Empresa Operadora',
      date: '2024-03-10 12:52 PM',
      imageUrl: null,
      position: { lat: 19.4326, lng: -99.1332 },
      label: { color: 'black', text: '5702' }
    },
    {
      name: 'Chapala Ajijic',
      det: 1403,
      company: 'Empresa Operadora',
      date: '2024-06-19 11:37 AM',
      imageUrl: null,
      position: { lat: 20.2975, lng: -103.2582 },
      label: { color: 'black', text: '1403' }
    },
    {
      name: 'Combo Patria',
      det: '6215-4071',
      company: 'Empresa Operadora',
      date: '2024-06-19 11:37 AM',
      imageUrl: null,
      position: { lat: 20.6597, lng: -103.3496 },
      label: { color: 'black', text: '6215-4071' }
    }
  ];

  ngOnInit(): void {}
}
