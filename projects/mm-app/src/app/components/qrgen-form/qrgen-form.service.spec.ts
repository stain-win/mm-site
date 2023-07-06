import { TestBed } from '@angular/core/testing';

import { QrgenFormService } from './qrgen-form.service';

describe('QrgenFormService', () => {
  let service: QrgenFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrgenFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
