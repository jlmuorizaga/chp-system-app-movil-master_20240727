import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidoAgregaTamanioPizzaPage } from './pedido-agrega-tamanio-pizza.page';

describe('PedidoAgregaTamanioPizzaPage', () => {
  let component: PedidoAgregaTamanioPizzaPage;
  let fixture: ComponentFixture<PedidoAgregaTamanioPizzaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoAgregaTamanioPizzaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
