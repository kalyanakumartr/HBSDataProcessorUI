import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectProcessCreateComponent } from './project-process-create.component';

describe('ProjectProcessCreateComponent', () => {
  let component: ProjectProcessCreateComponent;
  let fixture: ComponentFixture<ProjectProcessCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectProcessCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectProcessCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
