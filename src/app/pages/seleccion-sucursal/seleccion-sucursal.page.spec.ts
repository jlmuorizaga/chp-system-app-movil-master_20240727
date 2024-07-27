import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeleccionSucursalPage } from './seleccion-sucursal.page';

describe('SeleccionSucursalPage', () => {
  let component: SeleccionSucursalPage;
  let fixture: ComponentFixture<SeleccionSucursalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SeleccionSucursalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
