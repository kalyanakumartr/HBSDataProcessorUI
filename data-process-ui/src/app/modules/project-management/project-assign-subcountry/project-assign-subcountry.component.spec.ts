import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAssignSubcountryComponent } from './project-assign-subcountry.component';

describe('ProjectAssignSubcountryComponent', () => {
  let component: ProjectAssignSubcountryComponent;
  let fixture: ComponentFixture<ProjectAssignSubcountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectAssignSubcountryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAssignSubcountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
