// NO MODIFICAR CAMBIOS
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lista-estaciones',
  templateUrl: './lista-estaciones.component.html',
  styleUrls: ['./lista-estaciones.component.scss'],
  animations: [fadeInUpAnimation]
})
export class ListaEstacionesComponent implements OnInit {
  center = { lat: 23.6345, lng: -102.5528 };
  zoom = 5;
  searchTerm = '';
  showMapZoom = false;
  map!: google.maps.Map;
  private markers: google.maps.Marker[] = [];
  private activeInfoWindow: google.maps.InfoWindow | null = null;

  allOperations = [
    {
      opertion: 'Detalles',
      name: 'Santín',
      det: 5702,
      company: 'Operadora',
      date: '2024-03-10 12:52 PM',
      imageUrl: null,
      position: { lat: 19.4326, lng: -99.1332 }
    },
    {
      opertion: 'Detalles',
      name: 'Chapala Ajijic',
      det: 1403,
      company: 'Operadora',
      date: '2024-06-19 11:37 AM',
      imageUrl: null,
      position: { lat: 20.2975, lng: -103.2582 }
    },
    {
      opertion: 'Detalles',
      name: 'Combo Patria',
      det: '6215-4071',
      company: 'Operadora',
      date: '2024-06-19 11:37 AM',
      imageUrl: null,
      position: { lat: 20.6597, lng: -103.3496 }
    }
  ];

  operations = [...this.allOperations];

  constructor(private route: Router) {}

  ngOnInit(): void {
    this.loadGoogleMaps();
    this.initializeTooltips();
    this.showMapZoom = false;
  }

  irDetalle() {
    this.route.navigateByUrl('/estaciones/detalle-estaciones');
  }

  buscar() {
    const term = this.searchTerm.trim().toLowerCase();
    this.operations = term
      ? this.allOperations.filter(op => String(op.det).toLowerCase().includes(term))
      : [...this.allOperations];
    this.updateMapMarkers();
  }

  mostrarTodos() {
    this.searchTerm = '';
    this.operations = [...this.allOperations];
    this.updateMapMarkers();
    this.restaurarMapa();
  }

  loadGoogleMaps() {
    const init = () => {
      this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: this.center,
        zoom: this.zoom
      });

      this.updateMapMarkers();
      setTimeout(() => google.maps.event.trigger(this.map, 'resize'), 0);
    };

    if (typeof google !== 'undefined' && google.maps) {
      init();
      return;
    }

    (window as any).initMap = init;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&callback=initMap`;
    script.defer = true;
    document.head.appendChild(script);
  }

  private updateMapMarkers() {
    if (!this.map) {
      return;
    }

    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];

    const icon = {
      url: 'assets/images/aquagenia-marker.png',
      scaledSize: new google.maps.Size(50, 50),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(20, 40)
    };

    this.operations.forEach(operation => {
      const marker = new google.maps.Marker({
        position: operation.position,
        map: this.map,
        icon
      });

      const infoWindow = new google.maps.InfoWindow({
        content: this.buildInfoWindowContent(operation),
        maxWidth: 300,
        disableAutoPan: true
      });

      marker.addListener('mouseover', () => {
        this.activeInfoWindow?.close();
        infoWindow.open(this.map, marker);
        this.activeInfoWindow = infoWindow;
      });

      marker.addListener('mouseout', () => infoWindow.close());

      this.markers.push(marker);
    });
  }

  private buildInfoWindowContent(operation: (typeof this.allOperations)[number]): string {
    const name = this.escapeHtml(operation.name);
    const det = this.escapeHtml(String(operation.det));
    const company = this.escapeHtml(operation.company);
    const date = this.escapeHtml(operation.date);

    return `
      <div class="aquagenia-map-tip">
        <div class="aquagenia-map-tip__head">
          <span class="aquagenia-map-tip__dot"></span>
          <span class="aquagenia-map-tip__title">${name}</span>
        </div>
        <div class="aquagenia-map-tip__body">
          <div class="aquagenia-map-tip__row">
            <span class="aquagenia-map-tip__label">Determinante</span>
            <span class="aquagenia-map-tip__value aquagenia-map-tip__value--accent">${det}</span>
          </div>
          <div class="aquagenia-map-tip__row">
            <span class="aquagenia-map-tip__label">Empresa</span>
            <span class="aquagenia-map-tip__value">${company}</span>
          </div>
          <div class="aquagenia-map-tip__row">
            <span class="aquagenia-map-tip__label">Última lectura</span>
            <span class="aquagenia-map-tip__value">${date}</span>
          </div>
        </div>
      </div>
    `;
  }

  private escapeHtml(text: string): string {
    const el = document.createElement('div');
    el.textContent = text;
    return el.innerHTML;
  }

  restaurarMapa() {
    if (this.map) {
      this.showMapZoom = false;
      this.map.setCenter(this.center);
      this.map.setZoom(this.zoom);    
    }
  }
  

  centrarEnUbicacion(position: { lat: number; lng: number }) {
    console.log('Centrando en posición:', position);
    if (this.map) {
      this.showMapZoom = true;
      this.map.setCenter(position);
      this.map.setZoom(15);
    }
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
