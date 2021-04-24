import { TestBed } from '@angular/core/testing';

import { ApiCardService } from './api-card.service';

describe('CollectionService', () => {
  let service: ApiCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
