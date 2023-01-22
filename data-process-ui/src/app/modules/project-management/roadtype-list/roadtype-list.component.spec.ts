import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadtypeListComponent } from './roadtype-list.component';

describe('RoadtypeListComponent', () => {
  let component: RoadtypeListComponent;
  let fixture: ComponentFixture<RoadtypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoadtypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadtypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
