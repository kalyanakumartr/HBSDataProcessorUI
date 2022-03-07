import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAttendanceComponent } from './change-attendance.component';

describe('ChangeAttendanceComponent', () => {
  let component: ChangeAttendanceComponent;
  let fixture: ComponentFixture<ChangeAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
