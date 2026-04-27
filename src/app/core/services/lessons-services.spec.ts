import { TestBed } from '@angular/core/testing';

import { LessonsServices } from './lessons-services';

describe('LessonsServices', () => {
  let service: LessonsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonsServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
