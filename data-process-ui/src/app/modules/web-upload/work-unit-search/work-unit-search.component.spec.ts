import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkUnitSearchComponent } from './work-unit-search.component';

describe('WorkUnitSearchComponent', () => {
  let component: WorkUnitSearchComponent;
  let fixture: ComponentFixture<WorkUnitSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkUnitSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkUnitSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
