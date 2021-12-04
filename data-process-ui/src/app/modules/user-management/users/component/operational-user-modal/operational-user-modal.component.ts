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
import { BaseModel } from 'src/app/_metronic/shared/crud-table/models/base.model';
import { UserOperationalModel } from 'src/app/modules/auth/_models/user-operational.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


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
      emergencyContactNo:'',
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
  bloodGroup:'',
  martial:'',
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
      vaccinateInfo:'',
      lastDrawnSalary:'',
      resignedFAndF:false,
      esiEligible:false
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
      teamId: '',
      teamName: '',
      groupId: '',
      groupName: '',
      employeeId:'',
      divisionId:'',
      divisionName:'',
    },
    group:{
      teamId: '',
      teamName: '',
      groupId: '',
      groupName: '',
      employeeId:'',
      divisionId:'',
      divisionName:'',
    },
    deploy:{
      deploymentId: '',
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
  @Input() revId: string;
  @Input() role: string;
  isLoading$;
  customer: UserModel;
  updateRole:any;
  department:string;
  divisionList:any[];
  division:string;

  roleList:any[];
  projectList:any[];
  teamList:any[];
  groupList:any[];
  isAdminRole: boolean;
  roleId:string;
  departmentList:any[];
  reporting:string;
  reportingId:string;
  groupId:string;
  deploy:string;
  userId: BaseModel;
  userOPRModel :UserOperationalModel;
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
      this.reporting='';
      this.reportingId='';
      this.userOPRModel =new UserOperationalModel;
      this.userId= new UserOperationalModel;
      this.isAdminRole=false;
    }

  ngOnInit(): void {
    this.isLoading$ = this.usersService.isLoading$;
    this.userId.id=this.id;
    this.roleId=this.role;
    this.loadCustomer();
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
          console.log("Error");
          console.log("errorMessage", errorMessage);
          this.modal.dismiss(errorMessage);
          return of(EMPTY_CUSTOMER);
        })
      ).subscribe((customer: UserModel) => {
        console.log("Customer",customer);
        this.customer = customer;
        console.log(this.customer);
        this.loadEditForm();
        this.loadForm();
        this.assignControlValues();
        this.roleId = this.customer.roleId;
        this.division=this.customer.operationalRecord.division.divisionId;
        this.groupId=this.customer.operationalRecord.group.teamId;

        this.groupId = this.customer.operationalRecord.group.teamId ;
        if(this.groupId != ""){
          this.getTeamforGroup();
        }
        console.log("Check"+this.division);
        this.projectService.getProjectList(this.division).pipe(
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
        this.projectService.getGroupList(this.division).pipe(
          tap((res: any) => {
            this.groupList = res;
            console.log("groupList", this.groupList)
          }),
          catchError((err) => {
            console.log(err);
            return of({
              items: []
            });
          })).subscribe();
          this.getTeamforGroup();
      });


}
  }
  loadEditForm(){
    this.customer.email=this.customer.mediaList[0].emailId;
    /*this.roleId=this.customer.roleId;
    for(var role of this.roleList)
    if(role.roleId == this.roleId ){
      this.isAdminRole=role.isAdminRole;
    }*/
  }
  assignControlValues(){
    this.userOPRModel = EMPTY_CUSTOMER.operationalRecord;
    this.assignControlValue("teamId",this.customer.operationalRecord.team.teamId);

  }
  loadForm() {
    this.formGroup = this.fb.group({

      roles: [this.customer.roleId, Validators.compose([Validators.required])],
      teamId: [this.customer.operationalRecord.team.teamId, Validators.compose([Validators.required])],
      groupId: [this.customer.operationalRecord.group.teamId, Validators.compose([Validators.required])],
      department: [this.customer.operationalRecord.department.departmentId, Validators.compose([Validators.required])],
      division: [this.customer.operationalRecord.division.divisionId, Validators.compose([Validators.required])],
      //Change Reporting to
      reportingTo: [this.customer.operationalRecord.reportingTo, Validators.compose([Validators.required])],
      loginRFDB_BPS: [this.customer.operationalRecord.loginRFDB_BPS, Validators.compose([ Validators.minLength(3), Validators.maxLength(20)])],
      projectId: [this.customer.operationalRecord.project!=null?this.customer.operationalRecord.project.projectId:'0', Validators.compose([])],
      trainingBatch: [this.customer.operationalRecord.trainingBatch, Validators.compose([ Validators.minLength(3), Validators.maxLength(10)])],


    });
    this.reportingId=this.customer.operationalRecord.reportingToId;
  }

  save() {
    this.prepareCustomer();
    if (this.userId.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    var test ={"id":this.revId, "userRoless":[{roles:{}}]}
    const sbUpdate = this.usersService.saveOPR(this.userOPRModel, this.updateRole).pipe(
      tap(() => {
        this.modal.close();
        this.usersService.filterData("");
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.customer);
      }),
    ).subscribe(res =>this.openSnackBar(res.messageCode?"Update Successful":res,"!!"));
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
        this.usersService.filterData("");
      }),
      catchError((errorMessage) => {
        this.openSnackBar(errorMessage,"X");
        return of(this.customer);
      }),
    ).subscribe((res: UserModel) => res =>this.openSnackBar(res.messageCode?"Update Successful":res,"!!"));
    this.subscriptions.push(sbCreate);
  }
  setReportingToByGroup(value){
    var position =value.split(":")
    if(position.length>1){
      var group =this.groupList[position[0]-1];
      console.log(position[0],group);
      this.reporting=group.fullName;
      this.reportingId= group.reportingTo;
      this.groupId= position[1].toString().trim();
      this.getTeamforGroup();
    }
  }
  setReportingToByTeam(value){

    var position =value.split(":")
    if(position.length>1){
      var teamId= position[1].toString().trim();
      for(var team of this.teamList){
        if(team.teamId === teamId){
          this.reporting=team.fullName;
          this.reportingId= team.reportingTo;
          }
        }
      }
  }
  assignRole(value){
    var position =value.split(": ");
    if(position.length>1){
      this.isAdminRole= this.roleList[position[0]].isAdminRole;
      this.roleId=position[1];
    }
    this.getGroupforRole();
  }
  private prepareCustomer() {
    const formData = this.formGroup.value;

    this.customer.operationalRecord.trainingBatch = formData.trainingBatch;
    this.customer.operationalRecord.loginRFDB_BPS = formData.loginRFDB_BPS;
    this.customer.operationalRecord.team.groupId = formData.groupId;
    this.customer.operationalRecord.team.teamId = formData.teamId;
    this.customer.operationalRecord.department.departmentId = formData.department;
    this.customer.operationalRecord.reportingTo=this.reportingId;
    this.customer.operationalRecord.reportingToId=this.reportingId;
    this.customer.operationalRecord.project.projectId=formData.projectId;

    this.userOPRModel.trainingBatch= formData.trainingBatch;
    this.userOPRModel.loginRFDB_BPS = formData.loginRFDB_BPS;
    this.userOPRModel.group.teamId = formData.groupId;
    this.userOPRModel.team.teamId = formData.teamId;
    this.userOPRModel.team.employeeId = formData.reportingId;
    this.userOPRModel.department.departmentId = formData.department;
    this.userOPRModel.deploy.deploymentId = 'DLP0001';
    this.userOPRModel.reportingTo=this.reportingId;
    this.userOPRModel.reportingToId=this.reportingId;
    this.userOPRModel.project.projectId=formData.projectId;
    this.updateRole ={"id":this.revId, "userRoleses":[{roles:{ "roleId": this.roleId, "isAdminRole": this.isAdminRole}}]};
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
    this.teamList=[];
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
    this.roleService.getActiveRoleList(this.division).pipe(
      tap((res: any) => {
        this.roleList = res;
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
  getTeamforGroup(){
    this.teamList=[];
    this.projectService.getTeamList(this.groupId).pipe(
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
  getGroupforRole(){
    this.projectService.getGroupList(this.roleId).pipe(
      tap((res: any) => {
        this.groupList = res;
        console.log("groupList", this.groupList)
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
}
