import { TestBed } from '@angular/core/testing';

import { LigaPokemonService } from './liga-pokemon.service';

describe('LigaPokemonService', () => {
  let service: LigaPokemonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LigaPokemonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
