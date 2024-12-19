import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Customer, Employees, Service } from './app.service';
import ArrayStore from 'devextreme/data/array_store';

@Component({
  selector: 'app-detalle-estacion',
  templateUrl: './detalle-estacion.component.html',
  styleUrls: ['./detalle-estacion.component.scss'],
  providers: [Service],
  preserveWhitespaces: true,
})
export class DetalleEstacionComponent implements OnInit {
  dataSource: ArrayStore;

  employee: Employees[];

  constructor(service: Service) {
    this.customers = service.getCustomers();

    this.employee = service.getEmployee();

  }

  imagess = [
    'https://cdn-icons-png.flaticon.com/512/9131/9131529.png', // Internet
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROlYwQD8xnObt7tICAxChIjU6ZTK-dvuvnrQ&s', // Laptop
    'https://cdn-icons-png.flaticon.com/512/12538/12538108.png', // Mobile
    'https://w7.pngwing.com/pngs/670/44/png-transparent-telephone-computer-icons-facebook-email-whatsapp-address-phone-instagram-ic-miscellaneous-text-desktop-wallpaper.png', // PC
    'https://cdn-icons-png.flaticon.com/512/4829/4829008.png', // Phone
    'data:image/png;base64,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', // Printer
    'https://static.vecteezy.com/system/resources/thumbnails/002/583/030/small/cyber-security-and-information-or-network-protection-data-magnifier-analysis-line-style-icon-free-vector.jpg', // Router
    'https://cdn-icons-png.flaticon.com/512/9131/9131529.png', // Switch
    'https://cdn-icons-png.flaticon.com/512/9131/9131529.png', // Wi Fi
  ];

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
