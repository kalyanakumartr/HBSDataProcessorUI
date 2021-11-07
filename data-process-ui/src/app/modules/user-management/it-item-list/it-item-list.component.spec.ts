import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITItemListComponent } from './it-item-list.component';

describe('ITItemListComponent', () => {
  let component: ITItemListComponent;
  let fixture: ComponentFixture<ITItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ITItemListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ITItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
