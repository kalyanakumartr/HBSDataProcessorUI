import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrUserObjListComponent } from './hr-user-obj-list.component';

describe('UserListComponent', () => {
  let component: HrUserObjListComponent;
  let fixture: ComponentFixture<HrUserObjListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrUserObjListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HrUserObjListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
