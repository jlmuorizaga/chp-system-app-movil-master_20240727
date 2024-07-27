import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidoAgregaSalsaPage } from './pedido-agrega-salsa.page';

describe('PedidoAgregaSalsaPage', () => {
  let component: PedidoAgregaSalsaPage;
  let fixture: ComponentFixture<PedidoAgregaSalsaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoAgregaSalsaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
