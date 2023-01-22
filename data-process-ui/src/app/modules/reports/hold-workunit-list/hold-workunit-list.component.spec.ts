import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldWorkunitListComponent } from './hold-workunit-list.component';

describe('HoldWorkunitListComponent', () => {
  let component: HoldWorkunitListComponent;
  let fixture: ComponentFixture<HoldWorkunitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoldWorkunitListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldWorkunitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
