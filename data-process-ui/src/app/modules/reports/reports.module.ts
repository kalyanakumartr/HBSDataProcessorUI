
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { WebUploadReportComponent } from './web-upload-report/web-upload-report.component';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { MatIconModule } from '@angular/material/icon';
import { HoldWorkunitListComponent } from './hold-workunit-list/hold-workunit-list.component';
import { DeliverySummaryComponent } from './delivery-summary/delivery-summary.component';
import { WuDeliveryListComponent } from './wu-delivery-list/wu-delivery-list.component';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { WuHoldSummaryComponent } from './wu-hold-summary/wu-hold-summary.component';
import { WuDeliverySummaryComponent } from './wu-delivery-summary/wu-delivery-summary.component';
import { WuOverallSummaryComponent } from './wu-overall-summary/wu-overall-summary.component';



@NgModule({
  declarations: [WebUploadReportComponent,  ReportsComponent, HoldWorkunitListComponent, DeliverySummaryComponent, WuDeliveryListComponent, ProjectStatusComponent, WuHoldSummaryComponent, WuDeliverySummaryComponent, WuOverallSummaryComponent],
  imports: [
    CommonModule, ReportsRoutingModule,CommonModule,   HttpClientModule,
    CRUDTableModule,    FormsModule,    ReactiveFormsModule, InlineSVGModule, NgbDatepickerModule, NgbModalModule, MatSnackBarModule, MatPaginatorModule, MatTableModule,MatSortModule, MatDividerModule, MatExpansionModule,MatDatepickerModule,MatNativeDateModule, MatIconModule,MatFormFieldModule,MatInputModule], providers: [MatDatepickerModule, MatNativeDateModule],
})
export class ReportsModule { }
