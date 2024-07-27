import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidoProcesoDatosPage } from './pedido-proceso-datos.page';

describe('PedidoProcesoDatosPage', () => {
  let component: PedidoProcesoDatosPage;
  let fixture: ComponentFixture<PedidoProcesoDatosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoProcesoDatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
