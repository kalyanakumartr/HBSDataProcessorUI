import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { UsersService } from 'src/app/modules/auth/_services/user.service';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { RoleService } from 'src/app/modules/auth/_services/role.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';
import { ProjectService } from 'src/app/modules/auth/_services/project.services';
import { UserRoles } from 'src/app/modules/auth/_models/user-roles.model';
import { RoleModel } from 'src/app/modules/auth/_models/role.model';
import { Producer } from 'src/app/modules/auth/_models/producer.model';


const EMPTY_CUSTOMER: UserModel = {
  id: undefined,
  firstName: '',
  lastName: '',
  email: '',
  userName: '',
  fullname: '',
  pic: '',
  userRoles: [
    {
    roles:{
        id:'',
        roleId:'',
        isAdminRole:false
    }
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
      mediaId: '',
      emergencyNumber:'',
      district:''
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


  roleId:'',
  status:'',
  bloodGroup:'AB_Negative',
  martial:'UnMarried',
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
    isDongleProvided:false,
    dongleReturnDate:'',
    modemReturnDate:'',
    downGradedPlan:'',

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
      longLeaveFromDate:'',
      longLeaveToDate:'',
      longLeaveReason:'NotApplicable',
      approvedLeaveBalance :'',
      recruitmentType:'',
      costToCompany:'',
      vaccinateInfo:''
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
    id:'',
    team:{
      teamId: 'GRP9999',
      teamName: '',
      groupId: 'GRP0000',
      groupName: '',
      employeeId:'',
    },
    group:{
      teamId: 'GRP9999',
      teamName: '',
      groupId: 'GRP0000',
      groupName: '',
      employeeId:'',
    },
    deploy:{
      deploymentId: 'DLP0001',
      deploymentTaskName: ''
    },
    division:{
      divisionId: '',
      divisionName: ''
    },
    department:{
      departmentId: '',
      departmentName: ''
    },
    project:{
      projectId: 'CSAV1CM',
      projectName: ''
    },
    trainingBatch:'',
    reportingTo:'',
    reportingToId:'EDRAdmin',
    loginRFDB_BPS:''
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
  isAdminRole: boolean;
  customer: UserModel;
  roleList:any[];
  projectList:any[];
  teamList:any[];
  departmentList:any[];
  department:string;
  divisionList:any[];
  division:string;
  deploy:string;
  formGroup: FormGroup;
  role : RoleModel;
  producer : Producer;
  minDate : NgbDateStruct;
  maxDate : NgbDateStruct;
  private subscriptions: Subscription[] = [];
  constructor(
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private roleService: RoleService,
    private projectService: ProjectService,
    private authService: AuthService,
    private config: NgbDatepickerConfig,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.customer =new UserModel;
      this.role = new RoleModel;
      this.producer = new Producer;
      /*const current = new Date();
      config.minDate = { year: current.getFullYear(), month:
        current.getMonth() + 1, day: current.getDate() };
          //config.maxDate = { year: 2099, month: 12, day: 31 };
        config.outsideDays = 'hidden';*/
        const current = new Date();
        this.minDate = {
          year: current.getFullYear(),
          month: current.getMonth() + 1,
          day: current.getDate()
        };
        this.maxDate = {
          year: current.getFullYear()-18,
          month: current.getMonth() + 1,
          day: current.getDate()
        };
    }

  ngOnInit(): void {
    this.isLoading$ = this.usersService.isLoading$;

        this.projectService.getDepartmentList().pipe(
          tap((res: any) => {
            this.departmentList = res;
            this.loadCustomer();
            console.log("departmentList", this.departmentList)
          }),
          catchError((err) => {
            console.log(err);
            return of({
              items: []
            });
          })).subscribe();

          /*this.projectService.getTeamList("","").pipe(
            tap((res: any) => {
              this.teamList = res;
              console.log("teamList", this.teamList)
            }),
            catchError((err) => {
              console.log(err);
              return of({
                items: []
              });
            })).subscribe();*/

  }
  setDepartment(value){
    var position =value.split(":")
    if(position.length>1){
      this.department= position[1].toString().trim();
      this.getDivisionForDepartment();
    }
  }
  setDivision(value){
    var position =value.split(":")
    if(position.length>1){
      this.division= position[1].toString().trim();
      this.getRolesForDivision();
    }
  }
  getDivisionForDepartment(){
    this.divisionList=[];
    this.projectService.getDivisionList(this.department).pipe(
      tap((res: any) => {
        this.divisionList = res;
        console.log("divisionList", this.divisionList)
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  getRolesForDivision(){
    this.roleList=[];
    this.roleService.getActiveRoleList(this.division).pipe(
      tap((res: any) => {
        this.roleList = res;

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

        this.department=this.customer.operationalRecord.department.departmentId;
        this.division=this.customer.operationalRecord.division.divisionId;
        console.log("role",this.customer.roleId);
        this.role.roleId=this.customer.roleId;
        this.getDivisionForDepartment();
        this.getRolesForDivision();

        console.log("Check");
      });

    }
  }
  loadEditForm(){
    this.customer.email=this.customer.mediaList[0].emailId;
  }
  assignControlValues(){
    this.assignControlValue("deployId",this.customer.operationalRecord.deploy.deploymentId);
    this.assignControlValue("teamId",this.customer.operationalRecord.team.teamId);
    //this.assignControlValue("roles",this.customer.userRoles[0].roleId);

  }
  loadForm() {
    this.formGroup = this.fb.group({
      userName: [this.customer.userName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      fatherName: [this.customer.fatherName, Validators.compose([ Validators.minLength(1), Validators.maxLength(100)])],
      spouseName: [this.customer.spouseName, Validators.compose([ Validators.minLength(1), Validators.maxLength(100)])],
      userId: [this.customer.userId, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],

      dob: [this.customer.dob, Validators.compose([Validators.nullValidator])],
      sex: [this.customer.sex, Validators.compose([Validators.required])],
      phoneno: [this.customer.mediaList[0].mobileNo, Validators.compose([Validators.minLength(10), Validators.maxLength(12)])],
      address: [this.customer.mediaList[0].communicationAddress, Validators.compose([Validators.minLength(3), Validators.maxLength(200)])],

      department: [this.customer.operationalRecord.department.departmentId, Validators.compose([Validators.required])],
      division: [this.customer.operationalRecord.division.divisionId, Validators.compose([Validators.required])],
      roles: [this.customer.roleId, Validators.compose([Validators.required])],
      recruitmentType: [this.customer.hrRecord.employmentInfo.recruitmentType, Validators.compose([Validators.required])],
      status: [this.customer.hrRecord.employmentInfo.employmentStatus, Validators.compose([Validators.required])],
      doj: [this.customer.hrRecord.employmentInfo.dateOfJoin, Validators.compose([Validators.nullValidator])],
      ctc: [this.customer.hrRecord.employmentInfo.costToCompany, Validators.compose([Validators.nullValidator])],

      //teamId: [this.customer.team, Validators.compose([Validators.required])],
      //deployId: [this.customer.deploy, Validators.compose([Validators.required])],
      //email: [this.customer.email, Validators.compose([Validators.email])],
      //loginRFDB_BPS: [this.customer.loginRFDB_BPS, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      //password: [this.customer.password, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],

    });

  }

  save() {

    if (this.customer.id) {
      this.prepareCustomer("Edit");
      this.edit();
    } else {
      this.prepareCustomer("Create");
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.usersService.update(this.customer,"/updateUser","formUser").pipe(
      tap(() => {
        this.modal.close();
        this.usersService.filterData("");
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.customer);
      }),
      ).subscribe(res =>this.openSnackBar(res.messageCode?"Update Successful":res,"!!"));
    //this.subscriptions.push(sbUpdate);
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }
  create() {
    console.log("Add Employee");
    this.customer.mediaList[0].mediaId=undefined;
    const sbCreate = this.usersService.create(this.customer,"/addUser","formUser").pipe(
      tap(() => {
        this.modal.close();
        this.usersService.filterData("");
      }),
      catchError((errorMessage) => {
        this.openSnackBar(errorMessage,"X");
        return of(this.customer);
      }),
    ).subscribe((res: UserModel) => res =>this.openSnackBar(res.messageCode?"Employee Created Successful":res,"!!"));

    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer(createEdit) {
    const formData = this.formGroup.value;


    this.customer.userName = formData.userName;
    this.customer.fatherName = formData.fatherName;
    this.customer.spouseName = formData.spouseName;
    this.customer.userId=formData.userId;

    this.customer.dob = formData.dob;
    this.customer.sex = formData.sex;
    this.customer.mediaList[0].mobileNo =formData.phoneno;
    this.customer.mediaList[0].communicationAddress = formData.address;



    this.customer.operationalRecord.department.departmentId = formData.department;
    this.customer.operationalRecord.division.divisionId = formData.division;
    this.customer.hrRecord.employmentInfo.employmentStatus= formData.status;
    this.customer.hrRecord.employmentInfo.dateOfJoin =formData.doj;
    this.customer.hrRecord.employmentInfo.recruitmentType =formData.recruitmentType;
    this.customer.hrRecord.employmentInfo.costToCompany =formData.ctc;

    this.role.roleId = formData.roles;
    for(var role of this.roleList){
      if(role.roleId == this.role.roleId){
        this.isAdminRole = role.isAdminRole;
      }
    }
    this.role.isAdminRole =this.isAdminRole;
    if(this.customer.userRoles != undefined){
      for (var key in this.customer.userRoles[0]) {
          delete this.customer.userRoles[0][key];
      }
      this.customer.userRoles[0]= null;
      this.customer.userRoles[0]= new UserRoles;
    }else{
      this.customer.userRoles.push(new UserRoles)
    }

    this.customer.userRoles[0].roles =this.role;

    this.customer.employeeId=formData.userId;
    if(createEdit == "Edit"){
      this.producer.producerId='PRD000001';
      this.customer.producer= this.producer;
    }else{
    this.customer.producer=null;
    }


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
