import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUserObjListComponent } from './all-user-obj-list.component';

describe('UserListComponent', () => {
  let component: AllUserObjListComponent;
  let fixture: ComponentFixture<AllUserObjListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllUserObjListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllUserObjListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
