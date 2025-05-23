import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Customer, Employees, Service } from './app.service';
import ArrayStore from 'devextreme/data/array_store';
import { HttpClient } from '@angular/common/http';
import { DxDiagramComponent } from 'devextreme-angular';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { EstacionesService } from '../servicios/estaciones.service';

@Component({
  selector: 'app-detalle-estacion',
  templateUrl: './detalle-estacion.component.html',
  styleUrls: ['./detalle-estacion.component.scss'],
  providers: [Service],
  animations: [fadeInUpAnimation],
  preserveWhitespaces: true,
})
export class DetalleEstacionComponent implements OnInit {

  faIcons = [
    { name: 'Check', class: 'fa fa-check' },
    { name: 'Edit', class: 'fa fa-edit' },
    { name: 'Trash', class: 'fa fa-trash' },
    { name: 'Home', class: 'fa fa-home' },
    { name: 'User', class: 'fa fa-user' },
    { name: 'Bell', class: 'fa fa-bell' },
    { name: 'Star', class: 'fa fa-star' },
    { name: 'Heart', class: 'fa fa-heart' },
    { name: 'Search', class: 'fa fa-search' },
    { name: 'Envelope', class: 'fa fa-envelope' },
    { name: 'Cog', class: 'fa fa-cog' },
    { name: 'Camera', class: 'fa fa-camera' },
    { name: 'Car', class: 'fa fa-car' },
    { name: 'Book', class: 'fa fa-book' },
    { name: 'Calendar', class: 'fa fa-calendar' },
    { name: 'Cloud', class: 'fa fa-cloud' },
    { name: 'Comment', class: 'fa fa-comment' },
    { name: 'Download', class: 'fa fa-download' },
    { name: 'Folder', class: 'fa fa-folder' },
    { name: 'Gift', class: 'fa fa-gift' },
  ];

  dataSources: any[] = [
    {
      gastoInstantaneo: 0.57,
      gastoAcumulado: 302916.78,
      phCarcamo: 9.37,
      phEnvio: 5.57,
      clarificador: 38.79,
      demandaQuimica: 2.19,
      oxigenoDisuelto: 0.57,
      nitrogenoAmoniacal: 18.62,
      cloroResidual: 0.03,
    },
    {
      gastoInstantaneo: 2.90,
      gastoAcumulado: 302915.67,
      phCarcamo: 8.85,
      phEnvio: 8.60,
      clarificador: 16.60,
      demandaQuimica: 38.78,
      oxigenoDisuelto: 2.87,
      nitrogenoAmoniacal: 22.68,
      cloroResidual: 0.01,
    },
    {
      gastoInstantaneo: 1.32,
      gastoAcumulado: 302914.56,
      phCarcamo: 4.41,
      phEnvio: 4.14,
      clarificador: 5.75,
      demandaQuimica: 12.22,
      oxigenoDisuelto: 1.50,
      nitrogenoAmoniacal: 16.83,
      cloroResidual: 0.49,
    },
    {
      gastoInstantaneo: 0.44,
      gastoAcumulado: 302913.45,
      phCarcamo: 8.64,
      phEnvio: 9.09,
      clarificador: 12.21,
      demandaQuimica: 7.36,
      oxigenoDisuelto: 0.29,
      nitrogenoAmoniacal: 21.56,
      cloroResidual: 1.54,
    },
    {
      gastoInstantaneo: 0.29,
      gastoAcumulado: 302912.34,
      phCarcamo: 6.91,
      phEnvio: 9.66,
      clarificador: 40.00,
      demandaQuimica: 22.13,
      oxigenoDisuelto: 2.26,
      nitrogenoAmoniacal: 14.77,
      cloroResidual: 0.97,
    },
  ];

  items = [
    { name: 'Item 1' },
    { name: 'Item 2' },
    { name: 'Item 3' },
  ];

  images = [
    'assets/images/aquagenia.png',
    'assets/images/aquagenia.png',
    'assets/images/aquagenia.png'
  ];

  columns = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];
  public mensajeAgrupar: string = 'Arrastre un encabezado de columna aquí para agrupar por esa columna';
  public showFilterRow: boolean;
  public showHeaderFilter: boolean;
  
  @ViewChild('dropzone', { static: true }) dropzone!: ElementRef;
  @ViewChild(DxDiagramComponent, { static: false }) diagram: DxDiagramComponent;
  @ViewChild('cardContainer') cardContainer!: ElementRef;
  @ViewChildren('cardElement') cardElements!: QueryList<ElementRef>;
  private offset = { x: 0, y: 0 };
  private draggingIndex: number | null = null;
  droppedItems: any[] = [];
  dataSource: ArrayStore;
  isDiagramReadOnly: boolean = true;
  employee = [
    { ID: 1, Full_Name: 'Carlos Ramírez' },
    { ID: 2, Full_Name: 'Lucía Fernández' },
    { ID: 3, Full_Name: 'Jorge Hernández' },
    { ID: 4, Full_Name: 'Ana Torres' },
    { ID: 5, Full_Name: 'Marcos Díaz' },
  ];
  
  cambiarNombreEmpleado() {
    setTimeout(() => {
      const index = this.employee.findIndex(e => e.Full_Name === 'Carlos Ramírez');
      if (index !== -1) {
        this.employee[index].Full_Name = 'Rodrigo Silva';
  
        const diagram = this.diagram?.instance;
        if (diagram) {
          const jsonString = diagram.export(); // Exporta JSON actual
          const diagramData = JSON.parse(jsonString);
  
          // Buscar y actualizar el nodo que tenga ese texto
          const shapeToEdit = diagramData.shapes.find((shape: any) => shape.text === 'Carlos Ramírez');
          if (shapeToEdit) {
            shapeToEdit.text = 'Rodrigo Silva';
  
            const nuevoJSON = JSON.stringify(diagramData);
            diagram.import(nuevoJSON); // Reimportar con cambios
          }
        }
      }
    }, 10000); // 20 segundos
  }  

  sincronizarCaudalConDiagrama() {
    const diagram = this.diagram?.instance;
    if (!diagram) return;
  
    const jsonString = diagram.export();
    const diagramData = JSON.parse(jsonString);
  
    let cambios = false;
  
    this.listaParametros.forEach(param => {
      const shape = diagramData.shapes.find((s: any) => s.text === param.CaudalAnterior);
      if (shape && shape.text !== param.Caudal) {
        shape.text = param.Caudal;
        cambios = true;
      }
    });
  
    if (cambios) {
      const nuevoJSON = JSON.stringify(diagramData);
      diagram.import(nuevoJSON);
    }
  }
  
  
  cards: { 
    title: string; 
    isEditable: boolean; 
    isTitleEditable: boolean; 
    dataSource: any[]; 
    selectedIcon: string; 
  }[] = [];
  customers: Customer[];
  mapCenter = { lat: 19.4326, lng: -99.1332 }; 
  streetViewLocation = { lat: 19.4326, lng: -99.1332 }; 
  zoom = 14;
  currentIndex = 0;
  isAnimating = false;
  
  ngOnInit(): void {
    this.obtenerParametros(); // carga inicial
    this.cambiarNombreEmpleado(); // prueba del cambio manual
  
    setInterval(() => {
      this.obtenerParametros();
    }, 35000);
  
    this.http.get('assets/diagram-employees.json').subscribe({
      next: (data: any) => {
        this.diagram.instance.import(JSON.stringify(data));
      },
      error: (err) => {
        console.error('Error al cargar el archivo JSON:', err);
      },
    });
  }
  

  constructor(
    service: Service, 
    private http: HttpClient,
    private param: EstacionesService
  ) {
    this.customers = service.getCustomers();
    this.showFilterRow = true;
    this.showHeaderFilter = true;
  }

  public listaParametros: any;
  obtenerParametros() {
    this.param.obtenerParametros().subscribe((response: any[]) => {
      // Comparar antes de reemplazar
      if (!this.listaParametros || this.listaParametros.length === 0) {
        this.listaParametros = response.map(p => ({
          ...p,
          CaudalAnterior: p.Caudal
        }));
      } else {
        response.forEach(nuevo => {
          const actual = this.listaParametros.find(p => p.Id === nuevo.Id);
          if (actual && actual.Caudal !== nuevo.Caudal) {
            // Actualizó el caudal
            actual.CaudalAnterior = actual.Caudal;
            actual.Caudal = nuevo.Caudal;
          }
        });
      }
  
      // Actualizar diagrama si hay cambios
      this.actualizarCaudalesEnDiagrama();
    });
  }

  actualizarCaudalesEnDiagrama() {
    const diagram = this.diagram?.instance;
    if (!diagram) return;
  
    const json = diagram.export();
    const data = JSON.parse(json);
  
    let actualizado = false;
  
    this.listaParametros.forEach(p => {
      // 1. Actualizar si cambió el valor de Caudal
      if (p.Caudal !== p.CaudalAnterior) {
        const shape = data.shapes.find((s: any) => s.text === p.CaudalAnterior);
        if (shape) {
          shape.text = p.Caudal;
          actualizado = true;
          p.CaudalAnterior = p.Caudal;
        }
      }
  
      // 2. Agregar nuevo nodo si no existe
      const yaExiste = data.shapes.some((s: any) => s.id === `param-${p.Id}`);
      if (!yaExiste) {
        data.shapes.push({
          id: `param-${p.Id}`,
          text: p.Caudal,
          type: 'rectangle',
          left: 100 + data.shapes.length * 30,
          top: 100 + data.shapes.length * 30,
          width: 1.5,
          height: 0.75,
        });
        p.CaudalAnterior = p.Caudal;
        actualizado = true;
      }
    });
  
    if (actualizado) {
      diagram.import(JSON.stringify(data));
    }
  }
  
  
  
  
  iniciarSincronizacionCaudal() {
    setInterval(() => {
      this.listaParametros.forEach(param => {
        if (param.Caudal !== param.CaudalAnterior) {
          this.sincronizarCaudalConDiagrama();
          param.CaudalAnterior = param.Caudal;
        }
      });
    }, 5000); // Cada 5 segundos
  }
  
  
  toggleTitleEdit(index: number) {
    this.cards[index].isTitleEditable = !this.cards[index].isTitleEditable;
    this.cards[index].isEditable = !this.cards[index].isEditable;
  }
  
  saveDiagram(index: number) {
    console.log(`Diagrama ${index + 1} guardado`, this.cards[index]);
    const json = this.diagram.instance.export(); 
    const blob = new Blob([json], { type: 'application/json' }); 
    const url = URL.createObjectURL(blob); 
    const a = document.createElement('a'); 
    a.href = url;
    a.download = `diagram_${index + 1}.json`; 
    a.click(); 
    URL.revokeObjectURL(url); 
  }
  
  addNewCard() {
    this.cards.push({
      title: `Nuevo Diagrama ${this.cards.length + 1}`, 
      isEditable: true, 
      isTitleEditable: true, 
      dataSource: [], 
      selectedIcon: '', 
    });
  }

  exportDiagram() {
    const json = this.diagram.instance.export();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  imagess = [
    'https://cdn-icons-png.flaticon.com/512/9131/9131529.png', 
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROlYwQD8xnObt7tICAxChIjU6ZTK-dvuvnrQ&s',
    'https://cdn-icons-png.flaticon.com/512/12538/12538108.png', 
    'https://w7.pngwing.com/pngs/670/44/png-transparent-telephone-computer-icons-facebook-email-whatsapp-address-phone-instagram-ic-miscellaneous-text-desktop-wallpaper.png',
    'https://cdn-icons-png.flaticon.com/512/4829/4829008.png', 
    'data:image/png;base64,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', // Printer
    'https://static.vecteezy.com/system/resources/thumbnails/002/583/030/small/cyber-security-and-information-or-network-protection-data-magnifier-analysis-line-style-icon-free-vector.jpg',
    'https://cdn-icons-png.flaticon.com/512/9131/9131529.png', 
    'https://cdn-icons-png.flaticon.com/512/9131/9131529.png', 
  ];
  
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
      this.droppedItems[this.draggingIndex].x = Math.max(0, Math.min(newX, dropzoneRect.width - 100));
      this.droppedItems[this.draggingIndex].y = Math.max(0, Math.min(newY, dropzoneRect.height - 50));
    }
  };

  onMouseUp = () => {
    this.draggingIndex = null;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  ngAfterViewInit(): void {
    this.loadGoogleMaps();
  }

  loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCViGKafQxsHPmgGtlPsUDIaOdttLKJLk4&callback=initGoogleMaps`;
    script.defer = true;
    document.head.appendChild(script);

    (window as any).initGoogleMaps = () => {
      this.initializeMapAndStreetView();
    };
  }

  initializeMapAndStreetView() {
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: this.mapCenter,
      zoom: this.zoom
    });

    new google.maps.Marker({
      position: this.mapCenter,
      map,
      title: 'Ubicación en el mapa'
    });

    const panorama = new google.maps.StreetViewPanorama(
      document.getElementById('street-view') as HTMLElement,
      {
        position: this.streetViewLocation,
        pov: { heading: 165, pitch: 0 },
        zoom: 1
      }
    );
  }

  crearDiagrama() {
    this.addNewCard();
    setTimeout(() => {
      this.scrollToLastCard();
    }, 0);
  }

  scrollToLastCard() {
    if (this.cardElements && this.cardElements.last) {
      const lastCard = this.cardElements.last.nativeElement;
  
      const offsetTop = lastCard.offsetTop;
      const cardHeight = lastCard.offsetHeight;
      const viewportHeight = window.innerHeight;
  
      const scrollPosition = offsetTop - (viewportHeight / 2) + (cardHeight / 2);
      window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }
  }
  
  moveCarousel(direction: number) {
    if (this.isAnimating) return; 
    this.isAnimating = true;
    const totalImages = this.images.length;
    this.currentIndex = (this.currentIndex + direction + totalImages) % totalImages;
    setTimeout(() => {
      this.isAnimating = false;
    }, 500); 
  }

}