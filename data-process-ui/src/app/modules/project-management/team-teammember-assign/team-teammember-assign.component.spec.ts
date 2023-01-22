import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTeammemberAssignComponent } from './team-teammember-assign.component';

describe('TeamTeammemberAssignComponent', () => {
  let component: TeamTeammemberAssignComponent;
  let fixture: ComponentFixture<TeamTeammemberAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamTeammemberAssignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTeammemberAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
