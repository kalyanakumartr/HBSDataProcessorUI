import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { ApproveLeaveComponent } from './approve-leave/approve-leave.component';
import { LeaveManagementSystemComponent } from './leave-management-system.component';


const routes: Routes = [
  {
    path: '',
    component: LeaveManagementSystemComponent,
    children: [
      {
        path: 'lms',
        component: LeaveManagementSystemComponent,
      },
      {
        path: 'approveLeave',
        component: ApproveLeaveComponent,
      },
      {
        path: 'applyLeave',
        component: ApplyLeaveComponent,
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
