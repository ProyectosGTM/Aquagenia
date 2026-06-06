import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarModulosComponent } from './agregar-modulos.component';

describe('AgregarModulosComponent', () => {
  let component: AgregarModulosComponent;
  let fixture: ComponentFixture<AgregarModulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarModulosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarModulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
