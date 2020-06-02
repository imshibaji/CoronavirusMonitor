import { TestBed } from '@angular/core/testing';

import { CoronaStatusService } from './corona-status.service';

describe('CoronaStatusService', () => {
  let service: CoronaStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoronaStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
