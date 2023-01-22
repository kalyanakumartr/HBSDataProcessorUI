import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAssignRoadtypeComponent } from './project-assign-roadtype.component';

describe('ProjectAssignRoadtypeComponent', () => {
  let component: ProjectAssignRoadtypeComponent;
  let fixture: ComponentFixture<ProjectAssignRoadtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectAssignRoadtypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAssignRoadtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
