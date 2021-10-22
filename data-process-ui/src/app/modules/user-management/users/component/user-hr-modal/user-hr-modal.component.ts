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
import { UserModel } from 'src/app/modules/auth/_models/user.model';
import { Media } from 'src/app/modules/auth/_models/media.model';
import { BinaryOperatorToken } from 'typescript';

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
      emergencyNumber:''
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
    deploy:{
      deploymentId: 'DLP0001',
      deploymentTaskName: ''
    },
    department:{
      departmentId: '',
      departmentName: ''
    },
    division:{
      divisionId: '',
      divisionName: ''
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
  isFileCreated:false,
  longLeaveFromDate:'',
  longLeaveToDate:'',
  approvedLeaveBalance :'',
  recruitmentType:'',
  costToCompany:'',
  vaccinateInfo:'',
  longLeaveReason:''
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
  customer: UserModel;
  hrEmp: UserModel;
  userHRModel: UserHRModel;
  userId: BaseModel;
  isLongLeave :boolean;
  formGroup: FormGroup;
  media:Media;
  private subscriptions: Subscription[] = [];
  constructor(
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.userHRModel =new UserHRModel;
      this.userId= new UserHRModel;
      this.hrEmp= new UserModel;
      this.media = new Media;
      this.isLongLeave=false;
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
      const sbUser = this.usersService.getItemById(this.id.split("").reverse().join("")).pipe(
        first(),
        catchError((errorMessage) => {
          console.log("errorMessage", errorMessage);
          this.modal.dismiss(errorMessage);
          return of(EMPTY_CUSTOMER);
        })
      ).subscribe((customer: UserModel) => {
        this.customer = customer;
        console.log(this.customer);
        this.userHRModel = this.customer.hrRecord;
        this.loadForm();

        console.log("Check");
      });
      // const sb = this.usersService.fetchHR(this.id).pipe(
      //   first(),
      //   catchError((errorMessage) => {
      //     console.log("errorMessage", errorMessage);
      //     return of(EMPTY_HR_MODEL);
      //   })
      // ).subscribe((userHRModel: UserHRModel) => {
      //   console.log("UserHRModel", userHRModel);
      //   this.userHRModel = userHRModel;
      //   this.loadForm();
      // });

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


      dateOfJoin: [this.userHRModel.employmentInfo.dateOfJoin, Validators.compose([Validators.nullValidator])],
      infoAPL: [this.userHRModel.employmentInfo.infoAPL, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      employmentStatus: [this.userHRModel.employmentInfo.employmentStatus, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      experienceInEDR: [this.userHRModel.employmentInfo.experienceInEDR, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      experienceOutEDR: [this.userHRModel.employmentInfo.experienceOutEDR, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      fromNoticePeriod: [this.userHRModel.employmentInfo.fromNoticePeriod, Validators.compose([])],
      toNoticePeriod: [this.userHRModel.employmentInfo.toNoticePeriod, Validators.compose([])],
      idCardEDR: [this.userHRModel.employmentInfo.idCardEDR, Validators.compose([Validators.minLength(1), Validators.maxLength(20)])],
      lastWorkDay: [this.userHRModel.employmentInfo.lastWorkDay, Validators.compose([])],
      lastEmployer: [this.userHRModel.employmentInfo.lastEmployer, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      lastDesignation: [this.userHRModel.employmentInfo.lastDesignation, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      isOfferIssued: [this.userHRModel.employmentInfo.isOfferIssued, Validators.compose([])],
      isApprentice: [this.userHRModel.employmentInfo.isApprentice, Validators.compose([])],
      isFileCreated: [this.userHRModel.employmentInfo.isFileCreated, Validators.compose([])],
      longLeaveFromDate: [this.userHRModel.employmentInfo.longLeaveFromDate, Validators.compose([])],
      longLeaveToDate: [this.userHRModel.employmentInfo.longLeaveToDate, Validators.compose([])],
      recruitmentType: [this.userHRModel.employmentInfo.recruitmentType, Validators.compose([])],
      costToCompany: [this.userHRModel.employmentInfo.costToCompany, Validators.compose([])],
      vaccinateInfo: [this.userHRModel.employmentInfo.vaccinateInfo, Validators.compose([])],
      longLeaveReason: [this.userHRModel.employmentInfo.longLeaveReason, Validators.compose([])],

      personalEmailId: [ this.customer.mediaList[0].personalEmailId, Validators.compose([ Validators.email])],
      officialEmailId: [this.customer.mediaList[0].emailId, Validators.compose([ Validators.email])],
      phoneno: [this.customer.mediaList[0].mobileNo, Validators.compose([Validators.minLength(1), Validators.maxLength(13)])],
      alternateNumber: [this.customer.mediaList[0].alternateMobile, Validators.compose([Validators.minLength(1), Validators.maxLength(13)])],
      emergencyNumber: [this.customer.mediaList[0].alternateMobile, Validators.compose([Validators.minLength(1), Validators.maxLength(13)])],
      currentAddress: [this.customer.mediaList[0].communicationAddress, Validators.compose([Validators.minLength(1), Validators.maxLength(200)])],
      permanentAddress: [this.customer.mediaList[0].permanentAddress, Validators.compose([Validators.minLength(1), Validators.maxLength(200)])],
      maritialStatus: [this.customer.martial, Validators.compose([Validators.minLength(1), Validators.maxLength(20)])],
      spouseName: [this.customer.spouseName, Validators.compose([Validators.minLength(1), Validators.maxLength(20)])],
      bloodGroup: [this.customer.bloodGroup, Validators.compose([Validators.minLength(1), Validators.maxLength(20)])],
    });
  }

  save() {
    this.prepareCustomer();
    if (this.userId.id) {
      this.edit();
    }
  }

  edit() {

    const sbUpdate = this.usersService.saveHR(this.userHRModel, this.hrEmp).pipe(
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
    this.userHRModel.employmentInfo.dateOfJoin = formData.dateOfJoin;
    this.userHRModel.employmentInfo.infoAPL = formData.infoAPL;
    this.userHRModel.employmentInfo.employmentStatus = formData.employmentStatus;
    this.userHRModel.employmentInfo.experienceInEDR = formData.experienceInEDR;
    this.userHRModel.employmentInfo.experienceOutEDR = formData.experienceOutEDR;
    this.userHRModel.employmentInfo.fromNoticePeriod  = formData.fromNoticePeriod;
    this.userHRModel.employmentInfo.toNoticePeriod = formData.toNoticePeriod;
    this.userHRModel.employmentInfo.idCardEDR = formData.idCardEDR;
    this.userHRModel.employmentInfo.lastWorkDay = formData.lastWorkDay;
    this.userHRModel.employmentInfo.lastEmployer = formData.lastEmployer;
    this.userHRModel.employmentInfo.lastDesignation = formData.lastDesignation;
    this.userHRModel.employmentInfo.isOfferIssued = formData.isOfferIssued;
    this.userHRModel.employmentInfo.isApprentice = formData.isApprentice;
    this.userHRModel.employmentInfo.isFileCreated = formData.isFileCreated;
    if(this.isLongLeave){
      this.userHRModel.employmentInfo.longLeaveFromDate = formData.longLeaveFromDate;
      this.userHRModel.employmentInfo.longLeaveToDate = formData.longLeaveToDate;
      this.userHRModel.employmentInfo.longLeaveReason = formData.longLeaveReason;
    }else{
      this.userHRModel.employmentInfo.longLeaveFromDate = '';
      this.userHRModel.employmentInfo.longLeaveToDate = '';
      this.userHRModel.employmentInfo.longLeaveReason ='NotApplicable';
    }
    this.userHRModel.employmentInfo.recruitmentType = formData.recruitmentType;
    this.userHRModel.employmentInfo.costToCompany = formData.costToCompany;
    this.userHRModel.employmentInfo.vaccinateInfo = formData.vaccinateInfo;

    this.media.personalEmailId = formData.personalEmailId;
    this.media.emailId = formData.officialEmailId;
    this.media.mobileNo = formData.phoneno;
    this.media.alternateMobile = formData.alternateNumber;
    this.media.emergencyNumber = formData.emergencyNumber;
    this.media.communicationAddress = formData.currentAddress;
    this.media.permanentAddress = formData.permanentAddress;
    this.hrEmp.martial = formData.maritialStatus;
    this.hrEmp.spouseName = formData.spouseName;
    this.hrEmp.bloodGroup = formData.bloodGroup;
    this.hrEmp.id = this.userId.id;
    this.hrEmp.userId = this.customer.userId;
    this.hrEmp.userName = this.customer.userName;
    this.hrEmp.sex = this.customer.sex;
    this.hrEmp.dob = this.customer.dob;
    this.hrEmp.dateOfJoin = this.customer.hrRecord.employmentInfo.dateOfJoin;
    this.customer.mediaList[0]=this.media;
    this.hrEmp.mediaList = this.customer.mediaList;

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  checkEmpStatus(value){

    if(value == "ActiveLongLeave"){
      this.isLongLeave=true;
    }else{
      this.isLongLeave=false;
    }
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
