import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginaPagoDummyPage } from './pagina-pago-dummy.page';

describe('PaginaPagoDummyPage', () => {
  let component: PaginaPagoDummyPage;
  let fixture: ComponentFixture<PaginaPagoDummyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaPagoDummyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
