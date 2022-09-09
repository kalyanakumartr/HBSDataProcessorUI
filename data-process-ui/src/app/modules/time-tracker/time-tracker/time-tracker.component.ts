import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { AttendanceModel } from '../../attendance/modal/attendance.model';
import { TimeSheetModel } from '../../attendance/modal/timesheet.model';
import { DailyLogService } from '../../auth/_services/dailylog.services';
import { ProjectService } from '../../auth/_services/project.services';
import { TimeSheetService } from '../../auth/_services/timesheet.service';
import { DailyActivities } from '../modal/daily-activities.model';
import { UpdateDailyLog } from '../modal/update-dailylog.model';

@Component({
  selector: 'app-time-tracker',
  templateUrl: './time-tracker.component.html',
  styleUrls: ['./time-tracker.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class TimeTrackerComponent implements OnInit {
  @Input() timeSheet:TimeSheetModel;
  attendance: AttendanceModel;
  isLoading$;
  selValue:string;
  receivedDate:string;
  formGroup: FormGroup;
  projectId:any;
  processtId:any;
  projectSelected:any;
  projectList:any[];
  processList:any[];
  billType:any;
  dailyActivities: DailyActivities;
  logTime:string;
  remarks:string;
  updateDailyLog: UpdateDailyLog;
  private subscriptions: Subscription[] = [];
  constructor(
    private snackBar: MatSnackBar,
    private dailyLogService: DailyLogService,
    private projectService: ProjectService,
    public timeSheetService: TimeSheetService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.logTime="";
      this.remarks="";
      this.receivedDate="";
      this.selValue="0";
      this.projectId="CSAV1CM";
      this.billType='NBNP';
      this.updateDailyLog = new UpdateDailyLog;
      this.formGroup = new FormGroup({

        });
    }

  ngOnInit(): void {
    this.attendance=this.timeSheet.attendance;
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
    console.log("Inside Time Tracker ngOnInit", this.attendance);
  }
  private getDailyLog() {
    var getDailyActivityDate = this.changeDate(this.attendance.date);
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

  save() {

       var date =this.changeDate(this.attendance.date);

       const sbUpdate = this.dailyLogService.submitDailyLog( date).pipe(
        tap(() => {
          this.modal.dismiss();
          this.timeSheetService.filterData("");
        }),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          this.openSnackBar(errorMessage,"X");
          return of();
        }),
      ).subscribe(res =>this.openSnackBar("Time Sheet Submit "+res +" for the date " +date ,"."));

  }
  setProjectId(value){
    this.projectId =value;
    this.getProcess();
  }
  setProcess(value){
    this.processtId=value;
    for(let process of this.processList){
      if (value == process.processId){
        this.billType = process.billType;
      }
    }
  }
  getProcess(){
    if(this.projectId != undefined || this.projectId !=''){
      this.dailyLogService.getProcessList(this.projectId).pipe(
        tap((res: any) => {
          this.processList = res;
          console.log("processList", this.processList)
        }),
        catchError((err) => {
          console.log(err);
          return of({
            items: []
          });
        })).subscribe();
    }else{
      alert("Select Project Id");
    }
  }
  add(){
    if(this.projectId ==""){
      alert("Select Project");
      return;
    }
    if(this.processtId ==""){
      alert("Select Process");
      return;
    }
    if(this.logTime ==""){
      alert("Log Time");
      return;
    }
    if(this.dailyActivities.totalBillable && this.dailyActivities.max24Hours && this.logTime.replace(":",".")>this.dailyActivities.max24Hours.replace(":",".")){
      alert("TimeSheet you entered is more than 24 hours. Kindly verify the timesheet");
      return;
    }
    this.updateDailyLog.projectId=this.projectId;
    this.updateDailyLog.processId=this.processtId;
    this.updateDailyLog.actualTime=this.logTime;//.replace(":",".");
    this.updateDailyLog.comments=this.remarks;
    this.updateDailyLog.date=this.changeDate(this.attendance.date);
       const sbUpdate = this.dailyLogService.updateDailyLog( this.updateDailyLog).pipe(
      tap(() => {
        this.getDailyLog();
        //this.modal.dismiss();
        this.updateDailyLog = new UpdateDailyLog;
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        this.openSnackBar(errorMessage,"X");
        return of();
      }),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  deleteDailyLog(id, timesheetId){
    this.dailyLogService.deleteDailyLog(id,timesheetId).pipe(
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
    date = date.replace("-Jan-","/01/").replace("-Feb-","/02/").replace("-Mar-","/03/").replace("-Apr-","/04/").replace("-May-","/05/").replace("-Jun-","/06/").replace("-Jul-","/07/").replace("-Aug-","/08/").replace("-Sep-","/09/").replace("-Oct-","/10/").replace("-Nov-","/11/").replace("-Dec-","/12/");
    date =date.slice(0, 10);
     return date.split("-").reverse().join("/");
  }
}
