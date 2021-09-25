import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { UserListComponent } from './user-list/user-list.component';
import { HrUserObjListComponent } from './hr-user-obj-list/hr-user-obj-list.component';
import { ITUserObjListComponent } from './it-user-obj-list/it-user-obj-list.component';
import { ChangePasswordComponent } from '../user-profile/change-password/change-password.component';


const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    children: [
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'roles',
        component: RolesComponent,
      },
      {
        path:'opr-employee-list',
        component:UserListComponent
      },
      {
        path:'hr-employee-list',
        component:HrUserObjListComponent
      },
      {
        path:'it-employee-list',
        component:ITUserObjListComponent
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: '**', redirectTo: 'users', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
