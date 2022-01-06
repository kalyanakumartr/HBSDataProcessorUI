import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';
import { AttendanceComponent } from './attendance.component';
import { AttendanceRoutingModule } from './attendance-routing.modules';
import { GeneralModule } from 'src/app/_metronic/partials/content/general/general.module';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { IndividualAttendanceComponent } from './individual-attendance/individual-attendance.component';
import { GroupAttendanceComponent } from './group-attendance/group-attendance.component';



@NgModule({
  declarations: [MarkAttendanceComponent, AttendanceComponent, IndividualAttendanceComponent, GroupAttendanceComponent],
  imports: [
    CommonModule, AttendanceRoutingModule,NgbModalModule, MatSnackBarModule, MatButtonModule,GeneralModule
  ],
  exports: [MarkAttendanceComponent]
})
export class AttendanceModule { }
