import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleEstacionComponent } from './detalle-estacion.component';

describe('DetalleEstacionComponent', () => {
  let component: DetalleEstacionComponent;
  let fixture: ComponentFixture<DetalleEstacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleEstacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalleEstacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
