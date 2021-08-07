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
import { EditUserModalComponent } from './users/component/edit-user-modal/edit-user-modal.component';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { UserHRModalComponent } from './users/component/user-hr-modal/user-hr-modal.component';
import { UserITModalComponent } from './users/component/user-it-modal/user-it-modal.component';

@NgModule({
  declarations: [UsersComponent, RolesComponent, UserManagementComponent, UserListComponent, EditUserModalComponent, UserITModalComponent, UserHRModalComponent],
  imports: [CommonModule, UserManagementRoutingModule,   CommonModule,   HttpClientModule,
     CRUDTableModule,    FormsModule,    ReactiveFormsModule, InlineSVGModule, NgbDatepickerModule, NgbModalModule],
})
export class UserManagementModule {}
