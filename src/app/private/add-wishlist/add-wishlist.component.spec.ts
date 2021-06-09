import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWishlistComponent } from './add-wishlist.component';

describe('AddWishlistComponent', () => {
  let component: AddWishlistComponent;
  let fixture: ComponentFixture<AddWishlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWishlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
