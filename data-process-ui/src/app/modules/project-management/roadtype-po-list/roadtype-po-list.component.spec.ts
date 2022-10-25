import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadtypePoListComponent } from './roadtype-po-list.component';

describe('RoadtypePoListComponent', () => {
  let component: RoadtypePoListComponent;
  let fixture: ComponentFixture<RoadtypePoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoadtypePoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadtypePoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
