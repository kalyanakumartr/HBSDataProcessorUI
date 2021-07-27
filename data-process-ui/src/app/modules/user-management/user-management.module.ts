import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { UserManagementComponent } from './user-management.component';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';

@NgModule({
  declarations: [UsersComponent, RolesComponent, UserManagementComponent, UserListComponent],
  imports: [CommonModule, UserManagementRoutingModule,   CommonModule,   HttpClientModule,
     CRUDTableModule,    FormsModule,    ReactiveFormsModule, InlineSVGModule],
})
export class UserManagementModule {}
