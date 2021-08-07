import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { UsersService } from 'src/app/modules/auth/_services/user.service';
import { UserModel } from 'src/app/modules/auth';
import { UserITModel } from 'src/app/modules/auth/_models/user-it.model';


const EMPTY_CUSTOMER: UserITModel = {

  id: undefined,
  broadBandAccount:'',
  broadBandBy:'',
  internetPlan:'',
  isDowngraded:false,
  ispName:'',
  staticIPAddress:'',
  staticWhiteList:false,
  systemSerialNo:'',
  systemToHome:'',
  workMode:''

};
@Component({
  selector: 'app-it-user-modal',
  templateUrl: './user-it-modal.component.html',
  styleUrls: ['./user-it-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class UserITModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  isLoading$;
  userITModel: UserITModel;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private usersService: UsersService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.userITModel =new UserITModel;
    }

  ngOnInit(): void {
    this.isLoading$ = this.usersService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {

    this.id="";
    if (!this.id) {
      this.userITModel = EMPTY_CUSTOMER;
      this.loadForm();
    } else {
      console.log("this.id", this.id);
      const sb = this.usersService.fetchIT(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_CUSTOMER);
        })
      ).subscribe((userITModal: UserITModel) => {
        this.userITModel = userITModal;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      broadBandAccount: [this.userITModel.broadBandAccount, Validators.compose([ Validators.minLength(3), Validators.maxLength(100)])],
      broadBandBy: [this.userITModel.broadBandBy, Validators.compose([ Validators.minLength(3), Validators.maxLength(100)])],
      internetPlan: [this.userITModel.internetPlan, Validators.compose([ Validators.minLength(3), Validators.maxLength(100)])],
      isDowngraded: [this.userITModel.isDowngraded ],
      ispName: [this.userITModel.ispName, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      staticIPAddress: [this.userITModel.staticIPAddress, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      systemSerialNo : [this.userITModel.systemSerialNo, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      staticWhiteList: [this.userITModel.staticWhiteList, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      systemToHome: [this.userITModel.systemToHome, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      workMode: [this.userITModel.workMode, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],

    });
  }

  save() {
    this.prepareCustomer();
    if (this.userITModel.id) {
      this.edit();
    }
  }

  edit() {
    const sbUpdate = this.usersService.update(this.userITModel).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.userITModel);
      }),
    ).subscribe(res => this.userITModel = res);
    this.subscriptions.push(sbUpdate);
  }


  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.userITModel.broadBandAccount = formData.broadBandAccount;
    this.userITModel.broadBandBy = formData.broadBandBy;
    this.userITModel.internetPlan = formData.internetPlan;
    this.userITModel.isDowngraded = formData.isDowngraded;
    this.userITModel.ispName = formData.ispName;
    this.userITModel.staticIPAddress = formData.staticIPAddress;
    this.userITModel.staticWhiteList= formData.staticWhiteList;
    this.userITModel.systemSerialNo = formData.systemSerialNo;
    this.userITModel.systemToHome = formData.systemToHome;
    this.userITModel.workMode = formData.workMode;
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
