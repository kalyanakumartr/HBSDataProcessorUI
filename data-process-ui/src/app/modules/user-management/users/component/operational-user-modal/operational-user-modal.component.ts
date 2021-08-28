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
import { ProjectService } from 'src/app/modules/auth/_services/project.services';


const EMPTY_CUSTOMER: UserModel = {
  id: undefined,
  firstName: '',
  lastName: '',
  email: '',
  userName: '',
  fullname: '',
  pic: '',
  userRoleses: [
    {
        id:'',
        roleId:'',
        isAdminRole:false
    }
  ],
  occupation: '',
  companyName: '',
  dateOfJoin:'',
  dob:'',
  phone: '',
  employeeId:'',
  fatherName:'',
  spouseName:'',
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
      alternateMobile:'',
      communicationAddress:'',
      emailId: '',
      mobileNo: '',
      permanentAddress:'',
      personalEmailId:'',
      mediaType: 'Primary',
      mediaId: ''
    }
],
  language: '',
  timeZone: '',
  uniqueId:'',
  password:'',
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


  assignedRole:'',
  status:'',

  itRecord:{
    id: '',
    broadBandAccount:'',
    broadBandBy:'OWN',
    internetPlan:'',
    isDowngraded:false,
    ispName:'',
    staticIPAddress:'',
    staticWhiteList:false,
    systemSerialNo:'',
    systemToHome:false,
    workMode:'WFO',
  },
  hrRecord:{
    id:'',
    bankAccounts: {
      accountNo: '',
      bankName: '',
      bankBranch:'',
      ifscCode:'',
    },
    employmentInfo:{
      dateOfJoin:'',
      infoAPL: '',
      employmentStatus:'',
      experienceInEDR:'',
      experienceOutEDR:'',
      fromNoticePeriod:'',
      toNoticePeriod:'',
      idCardEDR:'',
      lastWorkDay:'',
      lastEmployer:'',
      lastDesignation:'',
      isOfferIssued:false,
      isApprentice:false,
      isFileCreated:false,
    },
    educationalInfo:{
      highestGraduate: '',
      institution: '',
      markGrade:'',
      year:'',
    },
    taxInfo:{
      aadhar: '',
      esic: '',
      providentFund:'',
      pan:'',
      uan:''
    }
  },
  operationalRecord:{
    team:{
      teamId: '',
      teamName: '',
      groupId: '',
      groupName: ''
    },
    deploy:{
      deploymentId: '',
      deploymentTaskName: ''
    },
    department:{
      departmentId: '',
      departmentName: ''
    },
    project:{
      projectId: '',
      projectName: ''
    },
    trainingBatch:'',
    reportingTo:'',
    reportingToId:'',
    loginRFDB_BPS:''
  }
};
@Component({
  selector: 'app-operational-user-modal',
  templateUrl: './operational-user-modal.component.html',
  styleUrls: ['./operational-user-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class OperationalUserModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  isLoading$;
  customer: UserModel;
  roleList:any[];
  projectList:any[];
  teamList:any[];
  departmentList:any[];
  deploy:string;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private roleService: RoleService,
    private projectService: ProjectService,
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
      this.projectService.getProjectList().pipe(
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
        this.projectService.getDepartmentList().pipe(
          tap((res: any) => {
            this.departmentList = res;
            console.log("departmentList", this.departmentList)
          }),
          catchError((err) => {
            console.log(err);
            return of({
              items: []
            });
          })).subscribe();
          this.projectService.getTeamList().pipe(
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
  }
  loadEditForm(){
    this.customer.email=this.customer.mediaList[0].emailId;
  }
  assignControlValues(){
    this.assignControlValue("deployId",this.customer.operationalRecord.deploy.deploymentId);
    this.assignControlValue("teamId",this.customer.operationalRecord.team.teamId);

  }
  loadForm() {
    this.formGroup = this.fb.group({

      roles: [this.customer.userRoleses[0].roleId, Validators.compose([Validators.required])],
      teamId: [this.customer.operationalRecord.team.teamId, Validators.compose([Validators.required])],
      department: [this.customer.operationalRecord.department.departmentId, Validators.compose([Validators.required])],
      //Change Reporting to
      reportingTo: [this.customer.operationalRecord.reportingToId, Validators.compose([Validators.required])],
      loginRFDB_BPS: [this.customer.operationalRecord.loginRFDB_BPS, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      projectId: [this.customer.operationalRecord.project.projectId, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      trainingBatch: [this.customer.operationalRecord.trainingBatch, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],


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
  setReportingTo(value){
    alert(value)
  }
  private prepareCustomer() {
    const formData = this.formGroup.value;

    this.customer.operationalRecord.trainingBatch = formData.trainingBatch;
    this.customer.operationalRecord.loginRFDB_BPS = formData.loginRFDB_BPS;
    this.customer.operationalRecord.team.teamId = formData.teamId;
    this.customer.operationalRecord.department.departmentId = formData.department;
    this.customer.operationalRecord.reportingTo=formData.reportingTo;
    this.customer.operationalRecord.reportingToId=formData.reportingToId;
    this.customer.operationalRecord.project.projectId=formData.projectId;
    this.customer.userRoleses[0].roleId=formData.roles;
    this.customer.userRoleses[0].isAdminRole =formData.roles.isAdminRole;
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
