import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroClienteCorreoPage } from './registro-cliente-correo.page';

describe('RegistroClienteCorreoPage', () => {
  let component: RegistroClienteCorreoPage;
  let fixture: ComponentFixture<RegistroClienteCorreoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroClienteCorreoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
