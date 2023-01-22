import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectProcessListComponent } from './project-process-list.component';

describe('ProjectProcessListComponent', () => {
  let component: ProjectProcessListComponent;
  let fixture: ComponentFixture<ProjectProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectProcessListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
