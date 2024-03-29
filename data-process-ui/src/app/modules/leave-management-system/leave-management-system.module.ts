import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveManagementSystemComponent } from './leave-management-system.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { GeneralModule } from 'src/app/_metronic/partials/content/general/general.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { LeaveManagementRoutingModule } from './leave-management-system-routing.modules';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { ApproveLeaveComponent } from './approve-leave/approve-leave.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { routes } from 'src/app/app-routing.module';
import { LeaveHistoryComponent } from './leave-history/leave-history.component';



@NgModule({
  declarations: [LeaveManagementSystemComponent, ApplyLeaveComponent, ApproveLeaveComponent, LeaveHistoryComponent],
  imports: [
    RouterModule.forChild(routes),CommonModule, FormsModule,    ReactiveFormsModule, LeaveManagementRoutingModule,InlineSVGModule, NgbDatepickerModule,NgbModalModule, MatSnackBarModule, MatButtonModule,MatIconModule,GeneralModule
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
})
export class LeaveManagementSystemModule { }
