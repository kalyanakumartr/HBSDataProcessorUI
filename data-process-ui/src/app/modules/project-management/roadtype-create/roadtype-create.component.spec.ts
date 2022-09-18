import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadtypeCreateComponent } from './roadtype-create.component';

describe('RoadtypeCreateComponent', () => {
  let component: RoadtypeCreateComponent;
  let fixture: ComponentFixture<RoadtypeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoadtypeCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadtypeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
