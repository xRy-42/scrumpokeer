import { TestBed } from '@angular/core/testing';

import { PokeerbaseService } from './pokeerbase.service';

describe('PokeerbaseService', () => {
  let service: PokeerbaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokeerbaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
