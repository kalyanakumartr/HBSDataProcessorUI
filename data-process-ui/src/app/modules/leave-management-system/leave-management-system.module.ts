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



@NgModule({
  declarations: [LeaveManagementSystemComponent],
  imports: [
    CommonModule, FormsModule,    ReactiveFormsModule, LeaveManagementRoutingModule,InlineSVGModule, NgbDatepickerModule,NgbModalModule, MatSnackBarModule, MatButtonModule,GeneralModule
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
})
export class LeaveManagementSystemModule { }
