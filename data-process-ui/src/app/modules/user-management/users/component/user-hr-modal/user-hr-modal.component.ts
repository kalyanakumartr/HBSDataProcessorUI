import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { UsersService } from 'src/app/modules/auth/_services/user.service';
import { UserModel } from 'src/app/modules/auth';


const EMPTY_CUSTOMER: UserModel = {
  id: undefined,
  firstName: '',
  lastName: '',
  email: '',
  userName: '',
  fullname: '',
  pic: '',
  roles: [],
  occupation: '',
  companyName: '',
  dateOfJoin:'',
  dob:'',
  phone: '',
  employeeId:'',
  fatherName:'',
  sex:'Male',
  userId:'',
  userImage:'',
  userStatus:'',
  userType:'',
  producerId:'100000DRP',
  producerName:'',
  parentProducerId:'100000DRP',
  parentProducerName:'',
  mediaList:[
    {
      emailId: '',
      mobileNo: '',
      mediaType: 'Primary',
      phoneNo:'',
      whatsAppNo: '',
      mediaId: ''
    }
],
  language: '',
  timeZone: '',
  uniqueId:'',
  password:'',
  loginRFDB_BPS:'',
  producer:{
    producerId:'100000DRP',
    producerName:'',
    parentProducerId:'100000DRP',
    parentProducerName:'',
  },
  country: {
    country: 'Asia/Kolkata',
    countryName: 'India'
  },
  team:{
    teamId: '',
    teamName: '',
    groupId: '',
    groupName: '',
  },
  deploy:{
    deploymentId: '',
    deploymentTaskName: ''
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
  isLoading$;
  userHrModal: UserModel;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private usersService: UsersService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.userHrModal =new UserModel;
    }

  ngOnInit(): void {
    this.isLoading$ = this.usersService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.userHrModal = EMPTY_CUSTOMER;
      this.loadForm();
    } else {
      console.log("this.id", this.id);
      const sb = this.usersService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_CUSTOMER);
        })
      ).subscribe((customer: UserModel) => {
        this.userHrModal = customer;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      firstName: [this.userHrModal.firstName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      lastName: [this.userHrModal.lastName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      email: [this.userHrModal.email, Validators.compose([Validators.required, Validators.email])],
      dob: [this.userHrModal.dob, Validators.compose([Validators.nullValidator])],
      userName: [this.userHrModal.userName, Validators.compose([Validators.required])],
      sex: [this.userHrModal.sex, Validators.compose([Validators.required])],

    });
  }

  save() {
    this.prepareCustomer();
    if (this.userHrModal.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.usersService.update(this.userHrModal).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.userHrModal);
      }),
    ).subscribe(res => this.userHrModal = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.usersService.create(this.userHrModal,"/addUser","formUser").pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.userHrModal);
      }),
    ).subscribe((res: UserModel) => this.userHrModal = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.userHrModal.dob = new Date(formData.dob);
    this.userHrModal.email = formData.email;
    this.userHrModal.firstName = formData.firstName;
    this.userHrModal.dob = formData.dob;

    this.userHrModal.lastName = formData.lastName;

    this.userHrModal.userName = formData.userName;
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
