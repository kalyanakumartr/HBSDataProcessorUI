import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WuHoldSummaryComponent } from './wu-hold-summary.component';

describe('WuHoldSummaryComponent', () => {
  let component: WuHoldSummaryComponent;
  let fixture: ComponentFixture<WuHoldSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WuHoldSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WuHoldSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
