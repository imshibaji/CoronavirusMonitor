import { TestBed } from '@angular/core/testing';

import { CoronaVirusService } from './corona-virus.service';

describe('CoronaVirusService', () => {
  let service: CoronaVirusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoronaVirusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
