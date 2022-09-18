import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRoadtypeComponent } from './project-roadtype.component';

describe('ProjectRoadtypeComponent', () => {
  let component: ProjectRoadtypeComponent;
  let fixture: ComponentFixture<ProjectRoadtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectRoadtypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRoadtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
