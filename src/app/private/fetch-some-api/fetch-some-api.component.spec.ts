import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchSomeApiComponent } from './fetch-some-api.component';

describe('FetchSomeApiComponent', () => {
  let component: FetchSomeApiComponent;
  let fixture: ComponentFixture<FetchSomeApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FetchSomeApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchSomeApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
