import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceComponent } from './attendance.component';
import { GroupAttendanceComponent } from './group-attendance/group-attendance.component';
import { IndividualAttendanceComponent } from './individual-attendance/individual-attendance.component';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';


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
        path: 'groupAttendance',
        component: GroupAttendanceComponent,
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
