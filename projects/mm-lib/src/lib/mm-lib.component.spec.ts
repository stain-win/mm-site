import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MmLibComponent } from './mm-lib.component';

describe('MmLibComponent', () => {
  let component: MmLibComponent;
  let fixture: ComponentFixture<MmLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MmLibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MmLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
