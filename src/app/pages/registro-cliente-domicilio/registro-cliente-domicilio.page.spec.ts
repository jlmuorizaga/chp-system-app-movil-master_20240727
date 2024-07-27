import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroClienteDomicilioPage } from './registro-cliente-domicilio.page';

describe('RegistroClienteDomicilioPage', () => {
  let component: RegistroClienteDomicilioPage;
  let fixture: ComponentFixture<RegistroClienteDomicilioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegistroClienteDomicilioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
