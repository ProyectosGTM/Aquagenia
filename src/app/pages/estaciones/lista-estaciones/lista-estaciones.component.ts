import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-estaciones',
  templateUrl: './lista-estaciones.component.html',
  styleUrls: ['./lista-estaciones.component.scss']
})
export class ListaEstacionesComponent implements OnInit {
  center = { lat: 23.6345, lng: -102.5528 }; // Center of Mexico
  zoom = 5;
  operations = [
    {
      opertion: 'Detalles',
      name: 'Santín',
      det: 5702,
      company: 'Operadora',
      date: '2024-03-10 12:52 PM',
      imageUrl: null,
      position: { lat: 19.4326, lng: -99.1332 },
      label: { color: 'black', text: '5702' }
    },
    {
      opertion: 'Detalles',
      name: 'Chapala Ajijic',
      det: 1403,
      company: 'Operadora',
      date: '2024-06-19 11:37 AM',
      imageUrl: null,
      position: { lat: 20.2975, lng: -103.2582 },
      label: { color: 'black', text: '1403' }
    },
    {
      opertion: 'Detalles',
      name: 'Combo Patria',
      det: '6215-4071',
      company: 'Operadora',
      date: '2024-06-19 11:37 AM',
      imageUrl: null,
      position: { lat: 20.6597, lng: -103.3496 },
      label: { color: 'black', text: '6215-4071' }
    }
  ];

  ngOnInit(): void {
    this.loadGoogleMaps();
    this.initializeTooltips();
  }

  loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCViGKafQxsHPmgGtlPsUDIaOdttLKJLk4&callback=initMap`;
    script.defer = true;
    document.head.appendChild(script);
  
    (window as any).initMap = () => {
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: this.center,
        zoom: this.zoom
      });
  
      const icon = {
        url: 'assets/images/marker.png',  // Ruta del ícono
        scaledSize: new google.maps.Size(50, 50),  // Ajusta el tamaño del ícono (ancho x alto)
        origin: new google.maps.Point(0, 0),  // Origen del ícono (opcional, puede ser (0, 0))
        anchor: new google.maps.Point(20, 40)  // Anclaje del ícono (centra el marcador en la base)
      };
  
      this.operations.forEach(operation => {
        const marker = new google.maps.Marker({
          position: operation.position,
          map,
          label: operation.label,
          icon: icon  // Aplica el ícono con tamaño ajustado
        });
  
        const infoWindow = new google.maps.InfoWindow({
          content: `<div><strong>${operation.name}</strong><br>
                    Operación: ${operation.opertion}<br>
                    Det: ${operation.det}<br>
                    Empresa: ${operation.company}<br>
                    Fecha: ${operation.date}</div>`
        });
  
        marker.addListener('mouseover', () => {
          infoWindow.open(map, marker);
        });
  
        marker.addListener('mouseout', () => {
          infoWindow.close();
        });
      });
    };
  }
  
  
  

  ngAfterViewInit() {
    this.initializeTooltips();
  }

  initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl: HTMLElement) {
      new (window as any).bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
  
}
