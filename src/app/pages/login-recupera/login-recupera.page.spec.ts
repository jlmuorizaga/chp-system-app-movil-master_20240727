import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginRecuperaPage } from './login-recupera.page';

describe('LoginRecuperaPage', () => {
  let component: LoginRecuperaPage;
  let fixture: ComponentFixture<LoginRecuperaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginRecuperaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
