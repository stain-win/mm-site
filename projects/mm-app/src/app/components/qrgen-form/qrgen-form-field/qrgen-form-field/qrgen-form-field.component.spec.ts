import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrgenFormFieldComponent } from './qrgen-form-field.component';

describe('QrgenFormFieldComponent', () => {
  let component: QrgenFormFieldComponent;
  let fixture: ComponentFixture<QrgenFormFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QrgenFormFieldComponent],
    });
    fixture = TestBed.createComponent(QrgenFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
