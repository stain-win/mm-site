import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrgenFormComponent } from './qrgen-form.component';

describe('QrgenFormComponent', () => {
  let component: QrgenFormComponent;
  let fixture: ComponentFixture<QrgenFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QrgenFormComponent]
    });
    fixture = TestBed.createComponent(QrgenFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
