import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { UsersService } from '../../auth/_services/user.service';

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
  isLoading$;
  selValue:string;
  receivedDate:string;
  formGroup: FormGroup;
  leaveTypeList:[];
  private subscriptions: Subscription[] = [];
  constructor(
    private snackBar: MatSnackBar,
    private timeTrackerService: UsersService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.receivedDate="";
      this.selValue="0";
      this.formGroup = new FormGroup({
        leaveType: new FormControl(),
        leaveFrom: new FormControl(),
        leaveTo: new FormControl(),
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

      leaveType: ['', Validators.compose([ ])],
      leaveFrom: ['', Validators.compose([ ])],
      leaveTo: ['', Validators.compose([ ])],
      reason:[''],


    });
    console.log("00000", this.formGroup.value);
  }
  setDefaultValue(){

  }

  save() {

        this.add();

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
