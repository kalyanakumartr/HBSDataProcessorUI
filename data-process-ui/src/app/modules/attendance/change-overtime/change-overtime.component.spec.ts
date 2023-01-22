import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOvertimeComponent } from './change-overtime.component';

describe('ChangeOvertimeComponent', () => {
  let component: ChangeOvertimeComponent;
  let fixture: ComponentFixture<ChangeOvertimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeOvertimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
