import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/_metronic/partials/content/general/general.module';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TimeTrackerRoutingModule } from './time-tracker-routing.modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { TimeTrackerComponent } from './time-tracker/time-tracker.component';



@NgModule({
  declarations: [TimeTrackerComponent],
  imports: [
    CommonModule, FormsModule,    ReactiveFormsModule, TimeTrackerRoutingModule,InlineSVGModule, NgbDatepickerModule,NgbModalModule, MatSnackBarModule, MatButtonModule,GeneralModule
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
  exports: []
})
export class TimeTrackerModule { }
