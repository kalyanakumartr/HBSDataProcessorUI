import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { AttendanceModel } from '../../attendance/modal/attendance.model';
import { DailyLogService } from '../../auth/_services/dailylog.services';
import { ProjectService } from '../../auth/_services/project.services';
import { UsersService } from '../../auth/_services/user.service';
import { DailyActivities } from '../modal/daily-activities.model';

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
  @Input() attendance: AttendanceModel;
  isLoading$;
  selValue:string;
  receivedDate:string;
  formGroup: FormGroup;
  projectId:any;
  projectSelected:any;
  projectList:any[];
  processList:any[];
  billable:boolean;
  dailyActivities: DailyActivities;
  private subscriptions: Subscription[] = [];
  constructor(
    private snackBar: MatSnackBar,
    private dailyLogService: DailyLogService,
    private projectService: ProjectService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.receivedDate="";
      this.selValue="0";
      this.projectId="CSAV1CM";
      this.billable=false;
      this.formGroup = new FormGroup({

        });
    }

  ngOnInit(): void {
    this.projectService.getProjectList("RFDB").pipe(
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

      var getDailyActivityDate = this.attendance.date.replace("-Jan-","/01/");
      this.dailyLogService.getDailyActivities(getDailyActivityDate).pipe(
        tap((res: any) => {
          this.dailyActivities = res;
          console.log("DailyActivities", this.dailyActivities)
        }),
        catchError((err) => {
          console.log(err);
          return of({
            items: []
          });
        })).subscribe();
    console.log("Inside Time Tracker ngOnInit", this.attendance);
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"bottom"
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

        this.add();

  }
  setProjectId(value){
    alert(value + this.projectId);
    this.projectId =value;
    this.getProcess();
  }
  setProcess(value){
    alert(value + this.projectId);
    this.projectId ='CSAV1CM';
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
   /* const sbUpdate = this.timeTrackerService.createTimeTracker().pipe(
      tap(() => {
        this.timeTrackerService.filterAssetData("");
        this.modal.dismiss();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        this.openSnackBar(errorMessage,"X");
        return of();
      }),
    ).subscribe(res =>this.openSnackBar(res.messageCode?"Created Successful":res,"!!"));*/
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  deleteDailyLog(id){
    this.dailyLogService.deleteDailyLog(id).pipe(
      tap((res: any) => {
        this.dailyActivities = res;
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
}
