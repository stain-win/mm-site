import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrgenNavigationComponent } from './qrgen-navigation.component';

describe('QrgenNavigationComponent', () => {
  let component: QrgenNavigationComponent;
  let fixture: ComponentFixture<QrgenNavigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QrgenNavigationComponent]
    });
    fixture = TestBed.createComponent(QrgenNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
