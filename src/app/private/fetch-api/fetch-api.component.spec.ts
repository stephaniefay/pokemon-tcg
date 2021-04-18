import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchApiComponent } from './fetch-api.component';

describe('FetchApiComponent', () => {
  let component: FetchApiComponent;
  let fixture: ComponentFixture<FetchApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FetchApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
