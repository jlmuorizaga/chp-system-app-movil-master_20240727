import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidoAgregaEspecialidadPage } from './pedido-agrega-especialidad.page';

describe('PedidoAgregaEspecialidadPage', () => {
  let component: PedidoAgregaEspecialidadPage;
  let fixture: ComponentFixture<PedidoAgregaEspecialidadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoAgregaEspecialidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
