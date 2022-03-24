import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { LeaveService } from '../../auth/_services/leave.services';
import { LeaveModel } from '../modal/leave.model';


@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class ApplyLeaveComponent implements OnInit {

  isLoading$;
  selValue:string;
  receivedDate:string;
  formGroup: FormGroup;
  minDate : NgbDateStruct;
  maxDate : NgbDateStruct;
  toMinDate : NgbDateStruct;
  toMaxDate : NgbDateStruct;
  leave:LeaveModel;
  //leaveTypeList:{ [key: number]: string }=[{"key":"leave","value":"Full Day Leave"},{"key":"p4","value":"Half Day Leave"},{"key":"longleave","value":"Long Leave"}, {"key":"medicalleave","value":"Medical Leave"}];
  leaveTypeList:{ [key: string]: string }={"Leave":"Leave","P4":"Half Day Leave","Long_Leave":"Long Leave","Medical_Leave":"Medical Leave"};
  private subscriptions: Subscription[] = [];
  constructor(
    private snackBar: MatSnackBar,
    private leaveServices: LeaveService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.receivedDate="";
      this.selValue="0";
      this.leave= new LeaveModel();
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
        leaveType: new FormControl(),
        reason: new FormControl(),
        });
    }

  ngOnInit(): void {
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
      leaveType: ['', Validators.compose([ ])],
      reason:[''],


    });
    console.log("00000", this.formGroup.value);
  }
  setDefaultValue(){

  }

  save() {

        this.add();

  }
  setToDate(){
    const formData = this.formGroup.value;
    var fromDate =new Date(formData.fromDate);
    this.formGroup.value.toDate=undefined;
    var leaveType = formData.leaveType;

    this.toMinDate = {
      year: fromDate.getFullYear(),
      month: fromDate.getMonth() + 1,
      day: fromDate.getDate()
    };
    if(leaveType=="Leave"){
      this.toMaxDate = {
        year: fromDate.getFullYear(),
        month: fromDate.getMonth() + 1,
        day: fromDate.getDate()+2
      };
    }
    if(leaveType=="P4"){
      this.toMaxDate = {
        year: fromDate.getFullYear(),
        month: fromDate.getMonth() + 1,
        day: fromDate.getDate()
      };
    }
    if(leaveType=="Long_Leave" || leaveType=="Medical_Leave"){
      this.toMaxDate = {
        year: fromDate.getFullYear(),
        month: fromDate.getMonth() + 3,
        day: fromDate.getDate()
      };
    }
  }
  resetDateFields(){

    this.formGroup.value.fromDate=undefined;
    this.formGroup.value.toDate=undefined;
  }
  add(){
    const formData = this.formGroup.value;
    if(!formData.fromDate){
      alert("Please Select the correct From Date");
      return;
    }
    if(!formData.toDate){
      alert("Please Select the correct To Date");
      return;
    }
    this.prepareCustomer();
    console.log("leave:",this.leave);
    const sbUpdate = this.leaveServices.applyLeave(this.leave).pipe(
      tap(() => {
        this.leaveServices.filterData("");
        this.modal.dismiss();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        this.leaveServices.filterData("");
        this.openSnackBar(errorMessage,"X");
        return of();
      }),
    ).subscribe(res =>this.openSnackBar(res.messageCode,"!!"));
  }
  private prepareCustomer() {
    const formData = this.formGroup.value;


    this.leave.date = this.getFormatedDate(formData.fromDate,"dd/MM/yyyy");
    this.leave.toDate =  this.getFormatedDate(formData.toDate,"dd/MM/yyyy");
    this.leave.symbol = formData.leaveType;
    this.leave.reason =formData.reason;
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

