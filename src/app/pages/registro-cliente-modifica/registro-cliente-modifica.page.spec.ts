import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroClienteModificaPage } from './registro-cliente-modifica.page';

describe('RegistroClienteModificaPage', () => {
  let component: RegistroClienteModificaPage;
  let fixture: ComponentFixture<RegistroClienteModificaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroClienteModificaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
