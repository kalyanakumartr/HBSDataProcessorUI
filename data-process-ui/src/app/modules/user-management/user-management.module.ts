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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { OperationalUserModalComponent } from './users/component/operational-user-modal/operational-user-modal.component';
import { HrUserObjListComponent } from './hr-user-obj-list/hr-user-obj-list.component';
import { ITUserObjListComponent } from './it-user-obj-list/it-user-obj-list.component';
import { ChangePasswordComponent } from '../user-profile/change-password/change-password.component';
import { SkillSetMatrixObjListComponent } from './skillset-marix-obj-list/skillset-marix-obj-list.component';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [UsersComponent, RolesComponent, UserManagementComponent, UserListComponent,HrUserObjListComponent, ITUserObjListComponent,SkillSetMatrixObjListComponent,EditUserModalComponent, UserITModalComponent, UserHRModalComponent,OperationalUserModalComponent, ChangePasswordComponent],
  imports: [CommonModule, UserManagementRoutingModule,   CommonModule,   HttpClientModule,
     CRUDTableModule,    FormsModule,    ReactiveFormsModule, InlineSVGModule, NgbDatepickerModule, NgbModalModule, MatSnackBarModule, MatPaginatorModule, MatTableModule,MatSortModule, MatDividerModule, MatExpansionModule],
})
export class UserManagementModule {}
