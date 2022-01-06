import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'builder',
        loadChildren: () =>
          import('./builder/builder.module').then((m) => m.BuilderModule),
      },

      {
        path: 'user-management',
        loadChildren: () =>
          import('../modules/user-management/user-management.module').then(
            (m) => m.UserManagementModule
          ),
      },
      {
        path: 'leave-management',
        loadChildren: () =>
          import('../modules/leave-management-system/leave-management-system.module').then(
            (m) => m.LeaveManagementSystemModule
          ),
      },
      {
        path: 'time-tracker',
        loadChildren: () =>
          import('../modules/time-tracker/time-tracker.module').then(
            (m) => m.TimeTrackerModule
          ),
      },
      {
        path: 'attendance',
        loadChildren: () =>
          import('../modules/attendance/attendance.module').then(
            (m) => m.AttendanceModule
          ),
      },
      {
        path: 'web-upload',
        loadChildren: () =>
          import('../modules/web-upload/web-upload.module').then(
            (m) => m.WebUploadModule
          ),
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('../modules/user-profile/user-profile.module').then(
            (m) => m.UserProfileModule
          ),
      },

      {
        path: 'wizards',
        loadChildren: () =>
          import('../modules/wizards/wizards.module').then(
            (m) => m.WizardsModule
          ),
      },

      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'error/404',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
