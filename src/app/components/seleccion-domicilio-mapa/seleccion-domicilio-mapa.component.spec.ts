import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeleccionDomicilioMapaComponent } from './seleccion-domicilio-mapa.component';

describe('SeleccionDomicilioMapaComponent', () => {
  let component: SeleccionDomicilioMapaComponent;
  let fixture: ComponentFixture<SeleccionDomicilioMapaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionDomicilioMapaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SeleccionDomicilioMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
