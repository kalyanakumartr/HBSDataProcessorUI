import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSubcountryListComponent } from './project-subcountry-list.component';

describe('ProjectSubcountryListComponent', () => {
  let component: ProjectSubcountryListComponent;
  let fixture: ComponentFixture<ProjectSubcountryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSubcountryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSubcountryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
