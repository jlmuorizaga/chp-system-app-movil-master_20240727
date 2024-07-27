import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidoAgregaProductoPage } from './pedido-agrega-producto.page';

describe('PedidoAgregaProductoPage', () => {
  let component: PedidoAgregaProductoPage;
  let fixture: ComponentFixture<PedidoAgregaProductoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoAgregaProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
