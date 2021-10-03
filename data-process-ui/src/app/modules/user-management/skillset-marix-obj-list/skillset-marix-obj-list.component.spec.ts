import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillSetMatrixObjListComponent } from './skillset-marix-obj-list.component';

describe('UserListComponent', () => {
  let component: SkillSetMatrixObjListComponent;
  let fixture: ComponentFixture<SkillSetMatrixObjListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillSetMatrixObjListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillSetMatrixObjListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
