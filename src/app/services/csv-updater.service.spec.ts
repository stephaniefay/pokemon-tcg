import { TestBed } from '@angular/core/testing';

import { CsvUpdaterService } from './csv-updater.service';

describe('CsvUpdaterService', () => {
  let service: CsvUpdaterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsvUpdaterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
