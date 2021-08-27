import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITUserObjListComponent } from './it-user-obj-list.component';

describe('UserListComponent', () => {
  let component: ITUserObjListComponent;
  let fixture: ComponentFixture<ITUserObjListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ITUserObjListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ITUserObjListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
