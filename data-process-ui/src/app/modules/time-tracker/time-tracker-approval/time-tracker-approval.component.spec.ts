import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTrackerApprovalComponent } from './time-tracker-approval.component';

describe('TimeTrackerApprovalComponent', () => {
  let component: TimeTrackerApprovalComponent;
  let fixture: ComponentFixture<TimeTrackerApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeTrackerApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeTrackerApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
