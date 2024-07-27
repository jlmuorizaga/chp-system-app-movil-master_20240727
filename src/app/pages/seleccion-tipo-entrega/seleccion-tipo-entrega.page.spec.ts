import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeleccionTipoEntregaPage } from './seleccion-tipo-entrega.page';

describe('SeleccionTipoEntregaPage', () => {
  let component: SeleccionTipoEntregaPage;
  let fixture: ComponentFixture<SeleccionTipoEntregaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SeleccionTipoEntregaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
