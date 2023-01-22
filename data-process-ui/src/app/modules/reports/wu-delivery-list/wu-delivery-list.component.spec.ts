import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WuDeliveryListComponent } from './wu-delivery-list.component';

describe('WuDeliveryListComponent', () => {
  let component: WuDeliveryListComponent;
  let fixture: ComponentFixture<WuDeliveryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WuDeliveryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WuDeliveryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
