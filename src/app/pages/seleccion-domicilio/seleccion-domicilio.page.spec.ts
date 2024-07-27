import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeleccionDomicilioPage } from './seleccion-domicilio.page';

describe('SeleccionDomicilioPage', () => {
  let component: SeleccionDomicilioPage;
  let fixture: ComponentFixture<SeleccionDomicilioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SeleccionDomicilioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
