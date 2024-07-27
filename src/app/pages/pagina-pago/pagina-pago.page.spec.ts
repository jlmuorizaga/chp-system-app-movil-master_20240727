import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginaPagoPage } from './pagina-pago.page';

describe('PaginaPagoPage', () => {
  let component: PaginaPagoPage;
  let fixture: ComponentFixture<PaginaPagoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
