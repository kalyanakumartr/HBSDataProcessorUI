import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AttendanceModel } from '../../attendance/modal/attendance.model';
import { DailyLogService } from '../../auth/_services/dailylog.services';
import { ProjectService } from '../../auth/_services/project.services';
import { Approval } from '../modal/approval.model';
import { DailyActivities } from '../modal/daily-activities.model';
import { TimeSheetApproval } from '../modal/time-sheet-approval.model';
import { UpdateDailyLog } from '../modal/update-dailylog.model';

@Component({
  selector: 'app-time-tracker-approval',
  templateUrl: './time-tracker-approval.component.html',
  styleUrls: ['./time-tracker-approval.component.scss']
})
export class TimeTrackerApprovalComponent implements OnInit {
  @Input() approval: Approval;
  @Input() timeSheet: TimeSheetApproval;
  isLoading$;
  selValue:string;
  receivedDate:string;
  formGroup: FormGroup;
  projectId:any;
  processtId:any;
  projectSelected:any;
  projectList:any[];
  processList:any[];
  billable:any;
  dailyActivities: DailyActivities;
  logTime:string;
  remarks:string;
  updateDailyLog: UpdateDailyLog;
  private subscriptions: Subscription[] = [];
  constructor(
    private snackBar: MatSnackBar,
    private dailyLogService: DailyLogService,
    private projectService: ProjectService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.logTime="";
      this.remarks="";
      this.receivedDate="";
      this.selValue="0";
      this.projectId="CSAV1CM";
      this.billable=false;
      this.updateDailyLog = new UpdateDailyLog;
      this.formGroup = new FormGroup({

        });
    }

  ngOnInit(): void {
    var authModel =this.projectService.getAuthFromLocalStorage();
    console.log(authModel);
    this.projectService.getProjectList(authModel.divisionId).pipe(
      tap((res: any) => {
        this.projectList = res;
        console.log("projectList", this.projectList)
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();

      this.getDailyLog();
    console.log("Inside Time Tracker ngOnInit", this.timeSheet.date);
  }
  private getDailyLog() {
    var getDailyActivityDate = this.changeDate(this.timeSheet.date);
    this.dailyLogService.getDailyActivities(getDailyActivityDate).pipe(
      tap((res: any) => {
        this.dailyActivities = res;
        console.log("DailyActivities", this.dailyActivities);
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }

  loadForm() {
    this.formGroup = this.fb.group({


    });
    console.log("00000", this.formGroup.value);
  }
  setDefaultValue(){

  }



  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  deleteDailyLog(id){
    this.dailyLogService.deleteDailyLog(id).pipe(
      tap((res: any) => {
        this.dailyActivities = res;
        this.getDailyLog();
        console.log("DailyActivities", this.dailyActivities)
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
  changeDate(date){
    return date.replace("-Jan-","/01/").replace("-Feb-","/02/").replace("-Mar-","/03/").replace("-Apr-","/04/").replace("-May-","/06/").replace("-Jun-","/06/").replace("-Jul-","/07/").replace("-Aug-","/08/").replace("-Sep-","/09/").replace("-Oct-","/10/").replace("-Nov-","/11/").replace("-Dec-","/12/");
  }
}
