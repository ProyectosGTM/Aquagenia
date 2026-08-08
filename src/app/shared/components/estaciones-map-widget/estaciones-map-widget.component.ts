import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { environment } from 'src/environments/environment';

export interface MapStationMarker {
  id: string | number;
  name: string;
  active: boolean;
  position: { lat: number; lng: number };
  lastReading?: string;
}

@Component({
  selector: 'app-estaciones-map-widget',
  templateUrl: './estaciones-map-widget.component.html',
  styleUrls: ['./estaciones-map-widget.component.scss'],
})
export class EstacionesMapWidgetComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLElement>;

  @Input() stations: MapStationMarker[] = [];
  @Input() center: { lat: number; lng: number } = { lat: 20.5, lng: -103.3 };
  @Input() zoom = 7;
  @Input() height = '280px';
  /** Filtrar: 'all' | 'active' | 'inactive' */
  @Input() statusFilter: 'all' | 'active' | 'inactive' = 'all';

  @Output() stationClick = new EventEmitter<MapStationMarker>();

  private map?: google.maps.Map;
  private markers: google.maps.Marker[] = [];
  private mapReady = false;
  private static scriptLoading = false;

  ngAfterViewInit(): void {
    this.loadGoogleMaps();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['stations'] || changes['statusFilter']) && this.mapReady) {
      this.renderMarkers();
    }
    if (changes['height'] && this.mapReady && this.map) {
      setTimeout(() => this.fitMapToMexico(), 0);
    }
  }

  ngOnDestroy(): void {
    this.clearMarkers();
  }

  private filteredStations(): MapStationMarker[] {
    if (this.statusFilter === 'active') {
      return this.stations.filter((s) => s.active);
    }
    if (this.statusFilter === 'inactive') {
      return this.stations.filter((s) => !s.active);
    }
    return this.stations;
  }

  private loadGoogleMaps(): void {
    if (typeof google !== 'undefined' && google.maps) {
      this.initMap();
      return;
    }
    if (EstacionesMapWidgetComponent.scriptLoading) {
      const check = setInterval(() => {
        if (typeof google !== 'undefined' && google.maps) {
          clearInterval(check);
          this.initMap();
        }
      }, 200);
      return;
    }
    EstacionesMapWidgetComponent.scriptLoading = true;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => this.initMap();
    script.onerror = () => {
      EstacionesMapWidgetComponent.scriptLoading = false;
    };
    document.head.appendChild(script);
  }

  private initMap(): void {
    if (!this.mapContainer?.nativeElement) {
      return;
    }
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: this.center,
      zoom: this.zoom,
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      /** Zoom con rueda sin Ctrl */
      gestureHandling: 'greedy',
      scrollwheel: true,
      styles: this.mapStyles(),
    });
    this.mapReady = true;
    this.renderMarkers();
  }

  /**
   * Estilo oscuro Aquagenia con límites estatales, países y vías visibles
   * también a zoom de país (sin “pintar” toda la geometría del mismo color).
   */
  private mapStyles(): google.maps.MapTypeStyle[] {
    return [
      { elementType: 'labels.text.fill', stylers: [{ color: '#9eb6c8' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#04141f' }, { weight: 2 }] },

      // Tierra / paisaje (no sobrescribe roads ni admin)
      { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0a2a3d' }] },
      { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#0c3147' }] },
      { featureType: 'poi', stylers: [{ visibility: 'off' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0d3550' }, { visibility: 'on' }] },

      // Agua
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#04141f' }] },
      { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4a6a80' }] },

      // Límites de país y estados — visibles desde lejos
      {
        featureType: 'administrative.country',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#e0e215' }, { weight: 1.4 }, { visibility: 'on' }],
      },
      {
        featureType: 'administrative.province',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#4db3e0' }, { weight: 1.1 }, { visibility: 'on' }],
      },
      {
        featureType: 'administrative.province',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#c5d9e8' }, { visibility: 'on' }],
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#8aa4b8' }, { visibility: 'on' }],
      },
      {
        featureType: 'administrative.land_parcel',
        stylers: [{ visibility: 'off' }],
      },

      // Vías: autopistas y arteriales visibles a zoom país; locales al acercar
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#166c9f' }, { visibility: 'on' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#0a4a6e' }, { visibility: 'on' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#2a8fc4' }, { visibility: 'on' }, { weight: 1.2 }],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels',
        stylers: [{ visibility: 'on' }],
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#1a7aad' }, { visibility: 'on' }],
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{ color: '#145a82' }, { visibility: 'simplified' }],
      },
      {
        featureType: 'transit',
        stylers: [{ visibility: 'off' }],
      },
    ];
  }

  private renderMarkers(): void {
    this.clearMarkers();
    if (!this.map) {
      return;
    }
    const list = this.filteredStations();

    list.forEach((station) => {
      const marker = new google.maps.Marker({
        map: this.map,
        position: station.position,
        title: station.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: station.active ? '#e0e215' : '#64748b',
          fillOpacity: 1,
          strokeColor: station.active ? '#166c9f' : '#334155',
          strokeWeight: 2,
        },
      });
      marker.addListener('click', () => this.stationClick.emit(station));
      this.markers.push(marker);
    });

    this.fitMapToMexico();
  }

  /** Vista fija: territorio completo de México */
  private fitMapToMexico(): void {
    if (!this.map) {
      return;
    }

    google.maps.event.trigger(this.map, 'resize');

    // Bounds aproximados del país (incluye península y Baja)
    const mexicoBounds = new google.maps.LatLngBounds(
      { lat: 14.5, lng: -118.5 }, // SW
      { lat: 32.8, lng: -86.5 }   // NE
    );
    this.map.fitBounds(mexicoBounds, { top: 24, right: 24, bottom: 24, left: 24 });
  }

  private clearMarkers(): void {
    this.markers.forEach((m) => m.setMap(null));
    this.markers = [];
  }
}
