import { TestBed } from '@angular/core/testing';

import { ExportedCSVService } from './exported-csv.service';

describe('ExportedCSVService', () => {
  let service: ExportedCSVService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportedCSVService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
