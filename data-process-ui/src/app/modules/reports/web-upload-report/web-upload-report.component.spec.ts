import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebUploadReportComponent } from './web-upload-report.component';

describe('WebUploadReportComponent', () => {
  let component: WebUploadReportComponent;
  let fixture: ComponentFixture<WebUploadReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebUploadReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebUploadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
