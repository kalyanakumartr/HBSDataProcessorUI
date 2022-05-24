import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LayoutService } from 'src/app/_metronic/core';
import { ProjectService } from '../../auth/_services/project.services';
import { WorkAllocationService } from '../../auth/_services/workallocation.service';

@Component({
  selector: 'app-work-unit-search',
  templateUrl: './work-unit-search.component.html',
  styleUrls: ['./work-unit-search.component.scss']
})
export class WorkUnitSearchComponent implements OnInit {
  @Input() projectId: any;
  @Input() group: any;
  isLoading$;
  selValue:string;
  receivedDate:string;
  receivedDateList:any;
  subCountry:string;
  subCountryList:any;
  roadType:string;
  roadTypeList:any;
  holdReason:string;
  holdReasonList:any;
  team:string;
  teamList:any;
  formGroup: FormGroup;
  minDate : NgbDateStruct;
  maxDate : NgbDateStruct;
  toMinDate : NgbDateStruct;
  toMaxDate : NgbDateStruct;

  //leaveTypeList:{ [key: number]: string }=[{"key":"leave","value":"Full Day Leave"},{"key":"p4","value":"Half Day Leave"},{"key":"longleave","value":"Long Leave"}, {"key":"medicalleave","value":"Medical Leave"}];
  leaveTypeList:{ [key: string]: string }={"Leave":"Leave","P4":"Half Day Leave","Long_Leave":"Long Leave","Medical_Leave":"Medical Leave"};
  private subscriptions: Subscription[] = [];
  constructor(
    private snackBar: MatSnackBar,
    public workAllocationService: WorkAllocationService,
    public projectService: ProjectService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.receivedDate="";
      this.selValue="0";
        const current = new Date();
        console.log(current.getFullYear(), current.getMonth(), current.getDate())
        this.maxDate={
          year: current.getFullYear(),
          month: current.getMonth() + 3,
          day: current.getDate()
        };
      this.minDate = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate()-7
      };
      this.toMaxDate={
        year: current.getFullYear(),
        month: current.getMonth() + 3,
        day: current.getDate()
      };
    this.toMinDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()-7
    };
      this.formGroup = new FormGroup({
        fromDate: new FormControl(),
        toDate: new FormControl(),
        workUnits: new FormControl(),
        wuMinMiles: new FormControl(),
        wuMaxMiles: new FormControl(),
        subCountry: new FormControl(),
        roadType: new FormControl(),
        holdReason: new FormControl(),
        team: new FormControl(),
        });
    }

  ngOnInit(): void {
    this.getReceivedDateList(this.projectId);
    this.getRoadTypeMapList(this.projectId);
    this.getReceivedDateList(this.projectId);

  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"bottom"
    });
  }

  loadForm() {
    this.formGroup = this.fb.group({

      fromDate: ['', Validators.compose([ ])],
      toDate: ['', Validators.compose([ ])],
      workUnits: [''],
      wuMinMiles: ['', Validators.compose([ ])],
      wuMaxMiles:[''],
      subCountry: ['', Validators.compose([ ])],
      roadType:['', Validators.compose([ ])],
      holdReason: ['', Validators.compose([ ])],
      team: ['', Validators.compose([ ])],

    });
    console.log("00000", this.formGroup.value);
  }
  setDefaultValue(){

  }
  getReceivedDateList(projectId){
    this.receivedDateList=[];
    this.workAllocationService.getReceivedDateList(projectId).pipe(
      tap((res: any) => {
        this.receivedDateList = res;
        if(this.receivedDateList.length>0){
          this.receivedDate = this.receivedDateList[0].projectId;
        }
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  getSubCountryList(projectId){
    this.subCountryList=[];
    this.workAllocationService.getSubCountryList(projectId).pipe(
      tap((res: any) => {
        this.subCountryList = res;
        if(this.subCountryList.length>0){
          this.subCountry = this.subCountryList[0].projectId;
        }
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  getRoadTypeMapList(projectId){
    this.roadTypeList=[];
    this.workAllocationService.getRoadTypeMapList(projectId).pipe(
      tap((res: any) => {
        this.roadTypeList = res;
        if(this.roadTypeList.length>0){
          this.roadType = this.roadTypeList[0].projectId;
        }
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  getTeamForGroup(){
    this.teamList=[];
    this.projectService.getTeamList(this.group).pipe(
      tap((res: any) => {
        this.teamList = res;
        console.log("teamList", this.teamList)
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  save() {



  }
  setToDate(){
    const formData = this.formGroup.value;
    var fromDate =new Date(formData.fromDate);
    this.formGroup.value.toDate=undefined;


    this.toMinDate = {
      year: fromDate.getFullYear(),
      month: fromDate.getMonth() + 1,
      day: fromDate.getDate()
    };

  }
  resetDateFields(){

    this.formGroup.value.fromDate=undefined;
    this.formGroup.value.toDate=undefined;
  }
  private prepareCustomer() {
    const formData = this.formGroup.value;


    // this.leave.date = this.getFormatedDate(formData.fromDate,"dd/MM/yyyy");
    // this.leave.toDate =  this.getFormatedDate(formData.toDate,"dd/MM/yyyy");
    // this.leave.symbol = formData.leaveType;
    // this.leave.reason =formData.reason;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
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
  // format date in typescript
getFormatedDate(date: Date, format: string) {
  const datePipe = new DatePipe('en-US');
  return datePipe.transform(date, format);
}
/*  formatDate(date){
    var MyDate =new Date(date);
     var MyDateString = ('0' + MyDate.getDate()).slice(-2) + '/'
      + ('0' + (MyDate.getMonth()+1)).slice(-2) + '/'
      + MyDate.getFullYear();
      return MyDateString;
  }*/
}

