import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveManagementSystemComponent } from './leave-management-system.component';

describe('LeaveManagementSystemComponent', () => {
  let component: LeaveManagementSystemComponent;
  let fixture: ComponentFixture<LeaveManagementSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveManagementSystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveManagementSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
