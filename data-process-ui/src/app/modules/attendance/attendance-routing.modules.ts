import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceComponent } from './attendance.component';
import { ChangeAttendanceComponent } from './change-attendance/change-attendance.component';
import { GroupAttendanceComponent } from './group-attendance/group-attendance.component';
import { IndividualAttendanceComponent } from './individual-attendance/individual-attendance.component';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';
import { TimesheetApprovalComponent } from './timesheet-approval/timesheet-approval.component';


const routes: Routes = [
  {
    path: '',
    component: AttendanceComponent,
    children: [
      {
        path: 'markAttendance',
        component: MarkAttendanceComponent,
      },
      {
        path: 'changeAttendance',
        component: ChangeAttendanceComponent,
      },
      {
        path: 'groupAttendance',
        component: GroupAttendanceComponent,
      },
      {
        path: 'approveTimeSheet',
        component: TimesheetApprovalComponent,
      },
      {
        path: 'myAttendance',
        component: IndividualAttendanceComponent,
      },
      { path: '', redirectTo: 'markAttendance', pathMatch: 'full' },
      { path: '**', redirectTo: 'markAttendance', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceRoutingModule {}
