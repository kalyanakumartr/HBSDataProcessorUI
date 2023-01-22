import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadtypePoCreateComponent } from './roadtype-po-create.component';

describe('RoadtypePoCreateComponent', () => {
  let component: RoadtypePoCreateComponent;
  let fixture: ComponentFixture<RoadtypePoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoadtypePoCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadtypePoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
