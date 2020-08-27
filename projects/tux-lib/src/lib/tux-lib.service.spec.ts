import { TestBed } from '@angular/core/testing';

import { TuxLibService } from './tux-lib.service';

describe('TuxLibService', () => {
  let service: TuxLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TuxLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
