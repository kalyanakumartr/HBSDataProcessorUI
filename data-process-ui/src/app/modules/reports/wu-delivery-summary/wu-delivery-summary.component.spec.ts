import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WuDeliverySummaryComponent } from './wu-delivery-summary.component';

describe('WuDeliverySummaryComponent', () => {
  let component: WuDeliverySummaryComponent;
  let fixture: ComponentFixture<WuDeliverySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WuDeliverySummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WuDeliverySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
