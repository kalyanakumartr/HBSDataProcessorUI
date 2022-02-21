import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';
import { AttendanceComponent } from './attendance.component';
import { AttendanceRoutingModule } from './attendance-routing.modules';
import { GeneralModule } from 'src/app/_metronic/partials/content/general/general.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { IndividualAttendanceComponent } from './individual-attendance/individual-attendance.component';
import { GroupAttendanceComponent } from './group-attendance/group-attendance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimesheetApprovalComponent } from './timesheet-approval/timesheet-approval.component';



@NgModule({
  declarations: [MarkAttendanceComponent, AttendanceComponent, IndividualAttendanceComponent, GroupAttendanceComponent, TimesheetApprovalComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,AttendanceRoutingModule,NgbModalModule, MatSnackBarModule, MatButtonModule,MatIconModule,GeneralModule, NgbDatepickerModule
  ],
  exports: [MarkAttendanceComponent]
})
export class AttendanceModule { }
