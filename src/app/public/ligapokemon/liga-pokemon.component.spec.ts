import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LigaPokemonComponent } from './liga-pokemon.component';

describe('LigapokemonComponent', () => {
  let component: LigaPokemonComponent;
  let fixture: ComponentFixture<LigaPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LigaPokemonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LigaPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
