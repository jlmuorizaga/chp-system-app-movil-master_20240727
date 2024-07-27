import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidoVistaPage } from './pedido-vista.page';

describe('PedidoVistaPage', () => {
  let component: PedidoVistaPage;
  let fixture: ComponentFixture<PedidoVistaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoVistaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
