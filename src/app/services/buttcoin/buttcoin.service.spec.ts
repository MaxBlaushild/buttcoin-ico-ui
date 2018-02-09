import { TestBed, inject } from '@angular/core/testing';

import { ButtcoinService } from './buttcoin.service';

describe('ButtcoinService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ButtcoinService]
    });
  });

  it('should be created', inject([ButtcoinService], (service: ButtcoinService) => {
    expect(service).toBeTruthy();
  }));
});
