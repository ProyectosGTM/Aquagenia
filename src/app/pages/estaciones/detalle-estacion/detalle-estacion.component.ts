import { Component, AfterViewInit, ViewChildren, QueryList, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer, Service } from './app.service';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { moduleEnterAnimation } from 'src/app/core/animations/module-enter.animation';
import { GridToolbarBase } from 'src/app/core/helpers/grid-toolbar.base';
import { EstacionesService } from '../servicios/estaciones.service';
import { DiagramEditorComponent } from './diagram-editor/diagram-editor.component';
import { DiagramBindableVariable, DiagramCard, DiagramElement } from './diagram-editor/diagram-editor.types';
import { DiagramPersistService } from './diagram-persist.service';

@Component({
  selector: 'app-detalle-estacion',
  templateUrl: './detalle-estacion.component.html',
  styleUrls: ['./detalle-estacion.component.scss'],
  providers: [Service],
  animations: [fadeInUpAnimation, moduleEnterAnimation],
  preserveWhitespaces: true,
})
export class DetalleEstacionComponent extends GridToolbarBase implements OnInit, AfterViewInit {

  /** ID de estación actual (mock Chapala hasta que venga por ruta) */
  estacionId = 'chapala';
  saveStatus = '';

  dataSources: any[] = [
    { gastoInstantaneo: 0.57, gastoAcumulado: 302916.78, phCarcamo: 9.37, phEnvio: 5.57, clarificador: 38.79, demandaQuimica: 2.19, oxigenoDisuelto: 0.57, nitrogenoAmoniacal: 18.62, cloroResidual: 0.03 },
    { gastoInstantaneo: 2.90, gastoAcumulado: 302915.67, phCarcamo: 8.85, phEnvio: 8.60, clarificador: 16.60, demandaQuimica: 38.78, oxigenoDisuelto: 2.87, nitrogenoAmoniacal: 22.68, cloroResidual: 0.01 },
    { gastoInstantaneo: 1.32, gastoAcumulado: 302914.56, phCarcamo: 4.41, phEnvio: 4.14, clarificador: 5.75, demandaQuimica: 12.22, oxigenoDisuelto: 1.50, nitrogenoAmoniacal: 16.83, cloroResidual: 0.49 },
    { gastoInstantaneo: 0.44, gastoAcumulado: 302913.45, phCarcamo: 8.64, phEnvio: 9.09, clarificador: 12.21, demandaQuimica: 7.36, oxigenoDisuelto: 0.29, nitrogenoAmoniacal: 21.56, cloroResidual: 1.54 },
    { gastoInstantaneo: 0.29, gastoAcumulado: 302912.34, phCarcamo: 6.91, phEnvio: 9.66, clarificador: 40.00, demandaQuimica: 22.13, oxigenoDisuelto: 2.26, nitrogenoAmoniacal: 14.77, cloroResidual: 0.97 },
  ];

  images = [
    'assets/images/aquagenia.png',
    'assets/images/aquagenia.png',
    'assets/images/aquagenia.png',
  ];

  paletteImages = [
    'https://cdn-icons-png.flaticon.com/512/9131/9131529.png',
    'https://cdn-icons-png.flaticon.com/512/12538/12538108.png',
    'https://cdn-icons-png.flaticon.com/512/4829/4829008.png',
    'https://cdn-icons-png.flaticon.com/512/9131/9131529.png',
  ];

  mensajeAgrupar = 'Arrastre un encabezado de columna aquí para agrupar por esa columna';
  showFilterRow = true;
  showHeaderFilter = true;

  @ViewChildren('cardElement') cardElements!: QueryList<any>;
  @ViewChildren(DiagramEditorComponent) diagramEditors!: QueryList<DiagramEditorComponent>;

  cards: DiagramCard[] = [];
  customers: Customer[];
  listaParametros: any[] = [];
  mapCenter = { lat: 19.4326, lng: -99.1332 };
  streetViewLocation = { lat: 19.4326, lng: -99.1332 };
  zoom = 14;
  currentIndex = 0;
  isAnimating = false;

  constructor(
    service: Service,
    private param: EstacionesService,
    private router: Router,
    private diagramPersist: DiagramPersistService
  ) {
    super();
    this.customers = service.getCustomers();
  }

  get estacionVariables(): DiagramBindableVariable[] {
    const row = this.dataSources[0] || {};
    const caudalLive = this.listaParametros?.[0]?.Caudal ?? row.gastoInstantaneo ?? '--';
    return [
      { key: 'caudal', label: 'Caudal', unit: 'L/s', value: caudalLive },
      { key: 'nivel_actual', label: 'Nivel actual', unit: '%', value: 68 },
      { key: 'ph_carcamo', label: 'PH Cárcamo', unit: '', value: row.phCarcamo ?? '--' },
      { key: 'ph_envio', label: 'PH Envío', unit: '', value: row.phEnvio ?? '--' },
      { key: 'oxigeno_disuelto', label: 'Oxígeno disuelto', unit: 'mg/L', value: row.oxigenoDisuelto ?? '--' },
      { key: 'cloro_residual', label: 'Cloro residual', unit: 'mg/L', value: row.cloroResidual ?? '--' },
      { key: 'gasto_acumulado', label: 'Gasto acumulado', unit: 'm³', value: row.gastoAcumulado ?? '--' },
    ];
  }

  ngOnInit(): void {
    this.cargarDiagramas();
    this.obtenerParametros();
    setInterval(() => this.obtenerParametros(), 35000);
  }

  ngAfterViewInit(): void {
    this.loadGoogleMaps();
  }

  cargarDiagramas(): void {
    this.diagramPersist.load(this.estacionId).subscribe((cards) => {
      this.cards = cards.map((c) => ({
        ...c,
        isEditable: c.isEditable ?? false,
        isTitleEditable: c.isTitleEditable ?? false,
        estacionId: this.estacionId,
      }));
    });
  }

  obtenerParametros(): void {
    this.param.obtenerParametros().subscribe((response: any[]) => {
      if (!this.listaParametros.length) {
        this.listaParametros = response.map((p) => ({
          ...p,
          CaudalAnterior: p.Caudal,
        }));
      } else {
        response.forEach((nuevo) => {
          const actual = this.listaParametros.find((p) => p.Id === nuevo.Id);
          if (actual && actual.Caudal !== nuevo.Caudal) {
            actual.CaudalAnterior = actual.Caudal;
            actual.Caudal = nuevo.Caudal;
          }
        });
      }
      this.syncDiagramEditors();
    });
  }

  private syncDiagramEditors(): void {
    this.diagramEditors?.forEach((editor) => editor.syncCaudalElements());
  }

  toggleTitleEdit(index: number): void {
    this.cards[index].isTitleEditable = !this.cards[index].isTitleEditable;
    this.cards[index].isEditable = !this.cards[index].isEditable;
  }

  onElementsChange(index: number, elements: DiagramElement[]): void {
    this.cards[index].elements = elements;
  }

  saveDiagram(index: number): void {
    const card = this.cards[index];
    card.estacionId = this.estacionId;
    this.diagramPersist.save(this.estacionId, this.cards).subscribe((res) => {
      this.saveStatus = res.ok ? `Guardado ${new Date(res.savedAt).toLocaleTimeString()}` : 'Error al guardar';
      setTimeout(() => (this.saveStatus = ''), 3500);
    });

    const payload = {
      estacionId: this.estacionId,
      title: card.title,
      elements: card.elements,
      savedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagrama_${this.estacionId}_${index + 1}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  addNewCard(): void {
    this.cards.push({
      title: `Diagrama ${this.estacionId} · ${this.cards.length + 1}`,
      isEditable: true,
      isTitleEditable: true,
      elements: [],
      estacionId: this.estacionId,
    });
  }

  loadGoogleMaps(): void {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCViGKafQxsHPmgGtlPsUDIaOdttLKJLk4&callback=initGoogleMaps`;
    script.defer = true;
    document.head.appendChild(script);
    (window as any).initGoogleMaps = () => this.initializeMapAndStreetView();
  }

  initializeMapAndStreetView(): void {
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: this.mapCenter,
      zoom: this.zoom,
    });
    new google.maps.Marker({ position: this.mapCenter, map, title: 'Ubicación en el mapa' });
    new google.maps.StreetViewPanorama(document.getElementById('street-view') as HTMLElement, {
      position: this.streetViewLocation,
      pov: { heading: 165, pitch: 0 },
      zoom: 1,
    });
  }

  irAlMapa(): void {
    this.router.navigate(['/estaciones/lista-estaciones']);
  }

  crearDiagrama(): void {
    const eraVacio = this.cards.length === 0;
    this.addNewCard();
    this.diagramPersist.save(this.estacionId, this.cards).subscribe();
    setTimeout(() => this.scrollToLastCard(eraVacio), eraVacio ? 120 : 0);
  }

  scrollToLastCard(esperarSeccion = false): void {
    const intentarScroll = (intentos = 0) => {
      const target = this.cardElements?.last?.nativeElement as HTMLElement | undefined;
      if (!target && intentos < 8) {
        setTimeout(() => intentarScroll(intentos + 1), 50);
        return;
      }
      if (!target) return;
      const offset = 88;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    };
    if (esperarSeccion) {
      setTimeout(() => intentarScroll(), 80);
      return;
    }
    intentarScroll();
  }

  get gallerySideImages(): { index: number; src: string }[] {
    return this.images
      .map((src, index) => ({ index, src }))
      .filter((item) => item.index !== this.currentIndex)
      .slice(0, 2);
  }

  moveCarousel(direction: number): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    const totalImages = this.images.length;
    this.currentIndex = (this.currentIndex + direction + totalImages) % totalImages;
    setTimeout(() => { this.isAnimating = false; }, 500);
  }
}
