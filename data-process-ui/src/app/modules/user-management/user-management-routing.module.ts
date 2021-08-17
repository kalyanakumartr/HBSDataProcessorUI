import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { UserListComponent } from './user-list/user-list.component';
import { AllUserObjListComponent } from './all-user-obj-list/all-user-obj-list.component';

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
        path:'user-list',
        component:UserListComponent
      },
      {
        path:'all-user-list',
        component:AllUserObjListComponent
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
