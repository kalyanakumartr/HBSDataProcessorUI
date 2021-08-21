import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { UsersService } from 'src/app/modules/auth/_services/user.service';

import { UserITModel } from 'src/app/modules/auth/_models/user-it.model';
import { BaseModel } from 'src/app/_metronic/shared/crud-table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserHRModel } from 'src/app/modules/auth/_models/user-hr.model';


const EMPTY_HR_MODEL: UserHRModel = {

  id: undefined,
  bankAccounts: {
    accountNo: '',
    bankName: '',
    bankBranch:'',
    ifscCode:''
  },
employmentInfo:{
  dateOfJoin:'',
  infoAPL: '',
  employmentStatus: '',
  experienceInEDR: '',
  experienceOutEDR: '',
  fromNoticePeriod: '',
  toNoticePeriod: '',
  idCardEDR: '',
  lastWorkDay: '',
  lastEmployer: '',
  lastDesignation: '',
  isOfferIssued:false,
  isApprentice:false,
  isFileCreated:false
},
educationalInfo:{
  highestGraduate: '',
  institution: '',
  markGrade:'',
  year:''
},
taxInfo:{
  aadhar: '',
  esic: '',
  providentFund:'',
  pan:'',
  uan:''
}

};
@Component({
  selector: 'app-hr-user-modal',
  templateUrl: './user-hr-modal.component.html',
  styleUrls: ['./user-hr-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class UserHRModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() name: string;
  isLoading$;
  userHRModel: UserHRModel;
  userId: BaseModel;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.userHRModel =new UserHRModel;
      this.userId= new UserHRModel;
    }

  ngOnInit(): void {
    this.isLoading$ = this.usersService.isLoading$;
    this.userId.id=this.id;
    this.loadCustomer();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }
  loadCustomer() {
    console.log("loadCustomer this.id", this.id);

    if (!this.id) {
      this.userHRModel = EMPTY_HR_MODEL;
      this.loadForm();
    } else {
      console.log("this.id", this.id);
      const sb = this.usersService.fetchHR(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          console.log("errorMessage", errorMessage);
          return of(EMPTY_HR_MODEL);
        })
      ).subscribe((userHRModel: UserHRModel) => {
        console.log("UserHRModel", userHRModel);
        this.userHRModel = userHRModel;
        this.loadForm();
      });

    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      accountNo: [this.userHRModel.bankAccounts.accountNo, Validators.compose([ Validators.minLength(3), Validators.maxLength(100)])],
      bankName: [this.userHRModel.bankAccounts.bankName, Validators.compose([ Validators.minLength(1), Validators.maxLength(100)])],
      bankBranch: [this.userHRModel.bankAccounts.bankBranch, Validators.compose([ Validators.minLength(3), Validators.maxLength(100)])],
      ifscCode: [this.userHRModel.bankAccounts.ifscCode, Validators.compose([ Validators.minLength(3), Validators.maxLength(100)])],

      highestGraduate: [this.userHRModel.educationalInfo.highestGraduate, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      institution : [this.userHRModel.educationalInfo.institution, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      markGrade: [this.userHRModel.educationalInfo.markGrade, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      year: [this.userHRModel.educationalInfo.year, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],

      aadhar: [this.userHRModel.taxInfo.aadhar, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      esic : [this.userHRModel.taxInfo.esic, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      providentFund: [this.userHRModel.taxInfo.providentFund, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      pan: [this.userHRModel.taxInfo.pan, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      uan: [this.userHRModel.taxInfo.uan, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],

    });
  }

  save() {
    this.prepareCustomer();
    if (this.userId.id) {
      this.edit();
    }
  }

  edit() {

    const sbUpdate = this.usersService.saveHR(this.userHRModel, this.userId).pipe(
      tap(() => {

        this.modal.close();

      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        this.openSnackBar(errorMessage,"X");
        return of(this.userHRModel);
      }),
    ).subscribe(res =>this.openSnackBar(res.messageCode?"Update Successful":res,"!!"));

  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.userHRModel.bankAccounts.accountNo = formData.accountNo;
    this.userHRModel.bankAccounts.bankName =formData.bankName;
    this.userHRModel.bankAccounts.bankBranch = formData.bankBranch;
    this.userHRModel.bankAccounts.ifscCode = formData.ifscCode;
    this.userHRModel.educationalInfo.highestGraduate = formData.highestGraduate;
    this.userHRModel.educationalInfo.institution = formData.institution;
    this.userHRModel.educationalInfo.markGrade= formData.markGrade;
    this.userHRModel.educationalInfo.year = formData.year;
    this.userHRModel.taxInfo.aadhar = formData.aadhar;
    this.userHRModel.taxInfo.esic = formData.esic;
    this.userHRModel.taxInfo.pan = formData.pan;
    this.userHRModel.taxInfo.providentFund = formData.providentFund;
    this.userHRModel.taxInfo.uan = formData.uan;
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
