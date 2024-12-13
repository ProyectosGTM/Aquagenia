import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-detalle-estacion',
  templateUrl: './detalle-estacion.component.html',
  styleUrls: ['./detalle-estacion.component.scss']
})
export class DetalleEstacionComponent implements AfterViewInit {
  // Coordenadas para el mapa y Street View
  mapCenter = { lat: 19.4326, lng: -99.1332 }; // Ubicación para el mapa
  streetViewLocation = { lat: 19.4326, lng: -99.1332 }; // Ubicación para Street View
  zoom = 14; // Nivel de zoom del mapa

  // Carrusel
  images = [
    'assets/images/aquagenia.png',
    'assets/images/aquagenia.png',
    'assets/images/aquagenia.png'
  ];
  currentIndex = 0;
  isAnimating = false;

  ngAfterViewInit(): void {
    this.loadGoogleMaps();
  }

  // Cargar el script de Google Maps
  loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCViGKafQxsHPmgGtlPsUDIaOdttLKJLk4&callback=initGoogleMaps`;
    script.defer = true;
    document.head.appendChild(script);

    (window as any).initGoogleMaps = () => {
      this.initializeMapAndStreetView();
    };
  }

  // Inicializa el mapa y el Street View
  initializeMapAndStreetView() {
    // Mapa
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: this.mapCenter,
      zoom: this.zoom
    });

    new google.maps.Marker({
      position: this.mapCenter,
      map,
      title: 'Ubicación en el mapa'
    });

    // Street View
    const panorama = new google.maps.StreetViewPanorama(
      document.getElementById('street-view') as HTMLElement,
      {
        position: this.streetViewLocation,
        pov: { heading: 165, pitch: 0 },
        zoom: 1
      }
    );
  }

  // Cambiar imagen en el carrusel con animación
  moveCarousel(direction: number) {
    if (this.isAnimating) return; // Evitar cambios mientras la animación está en curso

    this.isAnimating = true;
    const totalImages = this.images.length;
    this.currentIndex = (this.currentIndex + direction + totalImages) % totalImages;

    // Esperar el final de la animación antes de permitir otro cambio
    setTimeout(() => {
      this.isAnimating = false;
    }, 500); // Debe coincidir con la duración de la animación en CSS
  }
}
