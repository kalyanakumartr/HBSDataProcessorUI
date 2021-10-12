import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoRefreshComponent } from './auto-refresh.component';

describe('MyWorkComponent', () => {
  let component: AutoRefreshComponent;
  let fixture: ComponentFixture<AutoRefreshComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoRefreshComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoRefreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});