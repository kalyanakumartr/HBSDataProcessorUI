import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
        component: LeaveManagementSystemComponent,
      },
      {
        path: 'applyLeave',
        component: LeaveManagementSystemComponent,
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
