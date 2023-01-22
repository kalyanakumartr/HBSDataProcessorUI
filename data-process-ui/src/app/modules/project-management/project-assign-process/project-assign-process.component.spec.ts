import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAssignProcessComponent } from './project-assign-process.component';

describe('ProjectAssignProcessComponent', () => {
  let component: ProjectAssignProcessComponent;
  let fixture: ComponentFixture<ProjectAssignProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectAssignProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAssignProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
