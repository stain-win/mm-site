import { TestBed } from '@angular/core/testing';

import { MmLibService } from './mm-lib.service';

describe('MmLibService', () => {
  let service: MmLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MmLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
