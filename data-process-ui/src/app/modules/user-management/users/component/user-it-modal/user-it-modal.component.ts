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
import { FormControl } from '@angular/forms';


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
  systemToHome:false,
  workMode:'',
  isDongleProvided:false,
  dongleReturnDate:'',
  modemReturnDate:'',
  downGradedPlan:'',

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
  @Input() name: string;
  isLoading$;
  userITModel: UserITModel;
  userId: BaseModel;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.userITModel =new UserITModel;
      this.userId= new UserITModel;
      this.formGroup = new FormGroup({
          broadBandAccount: new FormControl(),
          broadBandBy: new FormControl(),
          internetPlan: new FormControl(),
          isDowngraded: new FormControl(),
          downGradedPlan: new FormControl(),
          ispName: new FormControl(),
          staticIPAddress: new FormControl(),
          systemSerialNo : new FormControl(),
          staticWhiteList: new FormControl(),
          systemToHome: new FormControl(),
          workMode: new FormControl(),
      });
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
      this.userITModel = EMPTY_CUSTOMER;
      this.loadForm();
    } else {
      console.log("this.id", this.id);
      const sb = this.usersService.fetchIT(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          console.log("errorMessage", errorMessage);
          return of(EMPTY_CUSTOMER);
        })
      ).subscribe((userITModal: UserITModel) => {
        console.log("UserITModel", userITModal);
        this.userITModel = userITModal;
        this.loadForm();
        console.log("----",this.userITModel.ispName,"---");
      });

    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      broadBandAccount: [this.userITModel.broadBandAccount, Validators.compose([ Validators.minLength(3), Validators.maxLength(100)])],
      broadBandBy: [this.userITModel.broadBandBy.trim()!=""?this.userITModel.broadBandBy:"0", Validators.compose([ Validators.minLength(3), Validators.maxLength(100)])],
      internetPlan: [this.userITModel.internetPlan, Validators.compose([ Validators.minLength(3), Validators.maxLength(100)])],
      isDowngraded: [this.userITModel.isDowngraded ],
      downGradedPlan:[this.userITModel.downGradedPlan,Validators.compose([Validators.minLength(3)])],
      ispName: [this.userITModel.ispName.trim()!=""?this.userITModel.ispName:"0", Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      staticIPAddress: [this.userITModel.staticIPAddress, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      systemSerialNo : [this.userITModel.systemSerialNo, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      staticWhiteList: [this.userITModel.staticWhiteList],
      systemToHome: [this.userITModel.systemToHome],
      workMode: [this.userITModel.workMode.trim()!=""?this.userITModel.workMode:"0", Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],

    });
  }

  save() {
    var invalid = this.findInvalidControls();
    var isValid = invalid.length>0?false:true;
    if(isValid){
      this.prepareCustomer();
      if (this.userId.id) {
        this.edit();
      }
    }else{
      alert("Please add valid values for "+invalid);
    }
  }

  edit() {

    const sbUpdate = this.usersService.saveIT(this.userITModel, this.userId).pipe(
      tap(() => {

        this.modal.close();
        this.usersService.filterData("");

      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        this.openSnackBar(errorMessage,"X");
        return of(this.userITModel);
      }),
    ).subscribe(res =>this.openSnackBar(res.messageCode?"Update Successful":res,"!!"));

  }


  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.userITModel.broadBandAccount = formData.broadBandAccount;
    this.userITModel.broadBandBy =formData.broadBandBy;
    this.userITModel.internetPlan = formData.internetPlan;
    this.userITModel.isDowngraded = formData.isDowngraded;
    this.userITModel.downGradedPlan = formData.downGradedPlan;
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
  public findInvalidControls() {
    const invalid = [];
    const controls = this.formGroup.controls;
    for (const name in controls) {
     // console.log(name,"--",controls[name].invalid);
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
  }
}
