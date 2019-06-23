import { TestBed } from '@angular/core/testing';

import { UalService } from './ual.service';

describe('UalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UalService = TestBed.get(UalService);
    expect(service).toBeTruthy();
  });
});
