import { TestBed } from '@angular/core/testing';

import { Levelservice } from './levelservice';

describe('Levelservice', () => {
  let service: Levelservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Levelservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
