import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WuOverallSummaryComponent } from './wu-overall-summary.component';

describe('WuOverallSummaryComponent', () => {
  let component: WuOverallSummaryComponent;
  let fixture: ComponentFixture<WuOverallSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WuOverallSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WuOverallSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
