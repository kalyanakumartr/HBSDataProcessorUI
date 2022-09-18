import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubcountryComponent } from './add-subcountry.component';

describe('AddSubcountryComponent', () => {
  let component: AddSubcountryComponent;
  let fixture: ComponentFixture<AddSubcountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSubcountryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubcountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
