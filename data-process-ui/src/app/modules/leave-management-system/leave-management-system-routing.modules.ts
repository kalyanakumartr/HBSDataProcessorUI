import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { ApproveLeaveComponent } from './approve-leave/approve-leave.component';
import { LeaveHistoryComponent } from './leave-history/leave-history.component';
import { LeaveManagementSystemComponent } from './leave-management-system.component';


const routes: Routes = [
  {
    path: '',
    component: LeaveManagementSystemComponent,
    children: [
      {
        path: 'lms',
        component: LeaveHistoryComponent,
        pathMatch: 'full'
      },
      {
        path: 'approveLeave',
        component: ApproveLeaveComponent,
        pathMatch: 'full'
      },
      {
        path: 'applyLeave',
        component: ApplyLeaveComponent,
        pathMatch: 'full'
      },
      { path: '', redirectTo: 'lms', pathMatch: 'full' },
      { path: '**', redirectTo: 'lms', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveManagementRoutingModule {}
