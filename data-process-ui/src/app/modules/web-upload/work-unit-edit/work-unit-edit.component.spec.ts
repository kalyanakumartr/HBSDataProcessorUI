import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkUnitEditComponent } from './work-unit-edit.component';

describe('WorkUnitEditComponent', () => {
  let component: WorkUnitEditComponent;
  let fixture: ComponentFixture<WorkUnitEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkUnitEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkUnitEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
