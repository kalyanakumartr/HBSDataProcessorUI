import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTeamAssignComponent } from './group-team-assign.component';

describe('GroupTeamAssignComponent', () => {
  let component: GroupTeamAssignComponent;
  let fixture: ComponentFixture<GroupTeamAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupTeamAssignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTeamAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
