import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadrePopupComponent } from './cadre-popup.component';

describe('CadrePopupComponent', () => {
  let component: CadrePopupComponent;
  let fixture: ComponentFixture<CadrePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadrePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadrePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
