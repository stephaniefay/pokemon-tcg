import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSomeComponent } from './import-some.component';

describe('ImportSomeComponent', () => {
  let component: ImportSomeComponent;
  let fixture: ComponentFixture<ImportSomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportSomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
