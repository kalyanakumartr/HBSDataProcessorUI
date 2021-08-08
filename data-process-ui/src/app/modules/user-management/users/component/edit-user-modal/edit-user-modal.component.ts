import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { UsersService } from 'src/app/modules/auth/_services/user.service';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { RoleService } from 'src/app/modules/auth/_services/role.services';
import { MatSnackBar } from '@angular/material/snack-bar';


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
  userStatus:'Pending',
  userType:'Employee',
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
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditUserModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  isLoading$;
  customer: UserModel;
  roleList:any[];
  deploy:string;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private roleService: RoleService,
    private authService: AuthService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.customer =new UserModel;
    }

  ngOnInit(): void {
    this.isLoading$ = this.usersService.isLoading$;
    this.roleService.getActiveRoleList().pipe(
      tap((res: any) => {
        this.roleList = res.items;
        this.loadCustomer();
        console.log("RoleList", this.roleList)
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();

  }

  loadCustomer() {
    if (!this.id) {
      this.customer = EMPTY_CUSTOMER;
      this.loadForm();
    } else {
      console.log("this.id", this.id);

      const sb = this.usersService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          console.log("errorMessage", errorMessage);
          this.modal.dismiss(errorMessage);
          return of(EMPTY_CUSTOMER);
        })
      ).subscribe((customer: UserModel) => {
        this.customer = customer;
        console.log(this.customer);
        this.loadEditForm();
        this.loadForm();
        this.assignControlValues();
        console.log("Check");
      });

    }
  }
  loadEditForm(){
    this.customer.email=this.customer.mediaList[0].emailId;
  }
  assignControlValues(){
    this.assignControlValue("deployId",this.customer.deploy.deploymentId);
    this.assignControlValue("teamId",this.customer.team.teamId);

  }
  loadForm() {
    this.formGroup = this.fb.group({
      userName: [this.customer.userName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      lastName: [this.customer.lastName, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      userId: [this.customer.userId, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      email: [this.customer.email, Validators.compose([Validators.email])],
      dob: [this.customer.dob, Validators.compose([Validators.nullValidator])],
      sex: [this.customer.sex, Validators.compose([Validators.required])],
      teamId: [this.customer.team, Validators.compose([Validators.required])],
      deployId: [this.customer.deploy, Validators.compose([Validators.required])],
      roles: [this.customer.roles, Validators.compose([Validators.required])],
      loginRFDB_BPS: [this.customer.loginRFDB_BPS, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      password: [this.customer.password, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],

    });

  }

  save() {
    this.prepareCustomer();
    if (this.customer.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.usersService.update(this.customer).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.customer);
      }),
    ).subscribe(res => this.customer = res);
    this.subscriptions.push(sbUpdate);
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }
  create() {
    console.log("Add User");
    const sbCreate = this.usersService.create(this.customer,"/addUser","formUser").pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.openSnackBar(errorMessage,"X");
        return of(this.customer);
      }),
    ).subscribe((res: UserModel) => res =>this.openSnackBar(res.messageCode?"Update Successful":res,"!!"));
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.customer.dob = new Date(formData.dob);
    this.customer.mediaList[0].emailId = formData.email;
    this.customer.firstName = formData.userName;
    this.customer.dob = formData.dob;
    this.customer.lastName = formData.lastName;
    this.customer.loginRFDB_BPS = formData.loginRFDB_BPS;
    this.customer.team.teamId = formData.teamId;
    this.customer.deploy.deploymentId = formData.deployId;
    this.customer.userName = formData.userName;
    this.customer.userId=formData.userId;
    this.customer.employeeId=formData.userId;
    this.customer.producer=null;

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
  assignControlValue(controlName, value) {
    const control = this.formGroup.controls[controlName];
    console.log("Control", control, "Value", value);
    control.setValue(value);
  }

}
