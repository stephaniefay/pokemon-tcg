import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDeckDialogComponent } from './info-deck-dialog.component';

describe('InfoDeckDialogComponent', () => {
  let component: InfoDeckDialogComponent;
  let fixture: ComponentFixture<InfoDeckDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoDeckDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoDeckDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
