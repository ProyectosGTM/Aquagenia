import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Customer, Service } from './app.service';

@Component({
  selector: 'app-detalle-estacion',
  templateUrl: './detalle-estacion.component.html',
  styleUrls: ['./detalle-estacion.component.scss'],
  providers: [Service],
})
export class DetalleEstacionComponent implements OnInit {

  constructor(service: Service) {
    this.customers = service.getCustomers();
  }

  ngOnInit(): void {
    
  }

  @ViewChild('dropzone', { static: true }) dropzone!: ElementRef;

  items = [
    { name: 'Item 1' },
    { name: 'Item 2' },
    { name: 'Item 3' },
  ];

  droppedItems: any[] = [];
  private offset = { x: 0, y: 0 };
  private draggingIndex: number | null = null;

  onDragStart(event: DragEvent, item: any) {
    event.dataTransfer?.setData('text', JSON.stringify(item));
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const data = event.dataTransfer?.getData('text');
    if (data) {
      const item = JSON.parse(data);
      const dropzoneRect = this.dropzone.nativeElement.getBoundingClientRect();
      item.x = event.clientX - dropzoneRect.left;
      item.y = event.clientY - dropzoneRect.top;
      this.droppedItems.push(item);
    }
  }

  onMouseDown(event: MouseEvent, index: number) {
    const dropzoneRect = this.dropzone.nativeElement.getBoundingClientRect();
    this.draggingIndex = index;
    this.offset = {
      x: event.clientX - dropzoneRect.left - this.droppedItems[index].x,
      y: event.clientY - dropzoneRect.top - this.droppedItems[index].y,
    };
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent) => {
    if (this.draggingIndex !== null) {
      const dropzoneRect = this.dropzone.nativeElement.getBoundingClientRect();
      const newX = event.clientX - dropzoneRect.left - this.offset.x;
      const newY = event.clientY - dropzoneRect.top - this.offset.y;

      // Ensure items stay within dropzone boundaries
      this.droppedItems[this.draggingIndex].x = Math.max(0, Math.min(newX, dropzoneRect.width - 100));
      this.droppedItems[this.draggingIndex].y = Math.max(0, Math.min(newY, dropzoneRect.height - 50));
    }
  };

  onMouseUp = () => {
    this.draggingIndex = null;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  customers: Customer[];

  columns = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];


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
