import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTeamGroupComponent } from './assign-team-group.component';

describe('AssignTeamGroupComponent', () => {
  let component: AssignTeamGroupComponent;
  let fixture: ComponentFixture<AssignTeamGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignTeamGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignTeamGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
