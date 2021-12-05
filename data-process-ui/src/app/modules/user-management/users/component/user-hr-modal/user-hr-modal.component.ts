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
import { FormControl } from '@angular/forms';

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
      teamId: 'GRP9999',
      teamName: '',
      groupId: 'GRP0000',
      groupName: '',
      employeeId:'',
      divisionId:'',
      divisionName:'',
    },
    group:{
      teamId: 'GRP9999',
      teamName: '',
      groupId: 'GRP0000',
      groupName: '',
      employeeId:'',
      divisionId:'',
      divisionName:'',
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
  longLeaveReason:'',
  lastDrawnSalary:'',
  resignedFAndF:false,
  esiEligible:false
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
  fileToUpload: File | null = null;
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
      this.formGroup = new FormGroup({
        accountNo           : new FormControl(),
        bankName            : new FormControl(),
        bankBranch          : new FormControl(),
        ifscCode            : new FormControl(),
        highestGraduate     : new FormControl(),
        institution         : new FormControl(),
        markGrade           : new FormControl(),
        year                : new FormControl(),
        aadhar              : new FormControl(),
        esic                : new FormControl(),
        providentFund       : new FormControl(),
        pan                 : new FormControl(),
        uan                 : new FormControl(),
        fnf                 : new FormControl(),
        esiEligible		      : new FormControl(),
        lastSalaryDrawn	    : new FormControl(),
        dateOfJoin          : new FormControl(),
        infoAPL             : new FormControl(),
        employmentStatus    : new FormControl(),
        experienceInEDR     : new FormControl(),
        experienceOutEDR    : new FormControl(),
        fromNoticePeriod    : new FormControl(),
        toNoticePeriod      : new FormControl(),
        idCardEDR           : new FormControl(),
        lastWorkDay         : new FormControl(),
        lastEmployer        : new FormControl(),
        lastDesignation     : new FormControl(),
        isOfferIssued       : new FormControl(),
        isApprentice        : new FormControl(),
        isFileCreated       : new FormControl(),
        longLeaveFromDate   : new FormControl(),
        longLeaveToDate     : new FormControl(),
        recruitmentType     : new FormControl(),
        costToCompany       : new FormControl(),
        vaccinateInfo       : new FormControl(),
        longLeaveReason     : new FormControl(),
        district            : new FormControl(),
        personalEmailId     : new FormControl(),
        officialEmailId     : new FormControl(),
        phoneno             : new FormControl(),
        alternateNumber     : new FormControl(),
        emergencyNumber     : new FormControl(),
        currentAddress      : new FormControl(),
        permanentAddress    : new FormControl(),
        maritialStatus      : new FormControl(),
        spouseName          : new FormControl(),
        bloodGroup          : new FormControl()
        }
      );
    }

  ngOnInit(): void {
    this.isLoading$ = this.usersService.isLoading$;
    this.userId.id=this.id;
    this.loadCustomer();

    console.log("Invalid Controls",this.findInvalidControls());
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
        console.log("customer dateOfJoin",this.customer.hrRecord.employmentInfo.dateOfJoin);
        console.log("Check",this.customer.hrRecord);
      });


    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      accountNo: [this.userHRModel.bankAccounts.accountNo, Validators.compose([ Validators.minLength(3), Validators.maxLength(20)])],
      bankName: [this.userHRModel.bankAccounts.bankName, Validators.compose([ Validators.minLength(1), Validators.maxLength(50)])],
      bankBranch: [this.userHRModel.bankAccounts.bankBranch, Validators.compose([ Validators.minLength(3), Validators.maxLength(50)])],
      ifscCode: [this.userHRModel.bankAccounts.ifscCode, Validators.compose([ Validators.minLength(3), Validators.maxLength(20)])],

      highestGraduate: [this.userHRModel.educationalInfo.highestGraduate, Validators.compose([Validators.minLength(3), Validators.maxLength(25)])],
      institution : [this.userHRModel.educationalInfo.institution, Validators.compose([Validators.minLength(3), Validators.maxLength(50)])],
      markGrade: [this.userHRModel.educationalInfo.markGrade, Validators.compose([Validators.minLength(1), Validators.maxLength(10)])],
      year: [this.userHRModel.educationalInfo.year, Validators.compose([Validators.minLength(4), Validators.maxLength(4)])],

      aadhar: [this.userHRModel.taxInfo.aadhar, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.minLength(12), Validators.maxLength(12)])],
      esic : [this.userHRModel.taxInfo.esic, Validators.compose([Validators.minLength(10), Validators.maxLength(17)])],
      providentFund: [this.userHRModel.taxInfo.providentFund, Validators.compose([Validators.minLength(10), Validators.maxLength(20)])],
      pan: [this.userHRModel.taxInfo.pan, Validators.compose([Validators.minLength(10), Validators.maxLength(15)])],
      uan: [this.userHRModel.taxInfo.uan==" "?"":this.userHRModel.taxInfo.uan, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.minLength(12), Validators.maxLength(12)])],
      fnf: [this.userHRModel.employmentInfo.resignedFAndF],
      esiEligible:[this.userHRModel.employmentInfo.esiEligible],
      lastSalaryDrawn:[this.userHRModel.employmentInfo.lastDrawnSalary, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.minLength(5), Validators.maxLength(7)])],


      dateOfJoin: [this.userHRModel.employmentInfo.dateOfJoin, Validators.compose([Validators.nullValidator])],
      infoAPL: [this.userHRModel.employmentInfo.infoAPL, Validators.compose([])],
      employmentStatus: [this.userHRModel.employmentInfo.employmentStatus, Validators.compose([Validators.minLength(1), Validators.maxLength(50)])],
      experienceInEDR: [this.userHRModel.employmentInfo.experienceInEDR, Validators.compose([Validators.minLength(1), Validators.maxLength(2)])],
      experienceOutEDR: [this.userHRModel.employmentInfo.experienceOutEDR, Validators.compose([Validators.minLength(1), Validators.maxLength(2)])],
      fromNoticePeriod: [this.userHRModel.employmentInfo.fromNoticePeriod, Validators.compose([])],
      toNoticePeriod: [this.userHRModel.employmentInfo.toNoticePeriod, Validators.compose([])],
      idCardEDR: [this.userHRModel.employmentInfo.idCardEDR, Validators.compose([Validators.minLength(5), Validators.maxLength(20)])],
      lastWorkDay: [this.userHRModel.employmentInfo.lastWorkDay, Validators.compose([])],
      lastEmployer: [this.userHRModel.employmentInfo.lastEmployer, Validators.compose([Validators.minLength(2), Validators.maxLength(50)])],
      lastDesignation: [this.userHRModel.employmentInfo.lastDesignation, Validators.compose([Validators.minLength(2), Validators.maxLength(50)])],
      isOfferIssued: [this.userHRModel.employmentInfo.isOfferIssued, Validators.compose([])],
      isApprentice: [this.userHRModel.employmentInfo.isApprentice, Validators.compose([])],
      isFileCreated: [this.userHRModel.employmentInfo.isFileCreated, Validators.compose([])],
      longLeaveFromDate: [this.userHRModel.employmentInfo.longLeaveFromDate, Validators.compose([])],
      longLeaveToDate: [this.userHRModel.employmentInfo.longLeaveToDate, Validators.compose([])],
      recruitmentType: [this.userHRModel.employmentInfo.recruitmentType, Validators.compose([])],
      costToCompany: [this.userHRModel.employmentInfo.costToCompany, Validators.compose([Validators.minLength(2), Validators.maxLength(10)])],
      vaccinateInfo: [this.userHRModel.employmentInfo.vaccinateInfo, Validators.compose([])],
      longLeaveReason: [this.userHRModel.employmentInfo.longLeaveReason, Validators.compose([])],
      district: [this.customer.mediaList[0].district, Validators.compose([])],

      personalEmailId: [ this.customer.mediaList[0].personalEmailId, Validators.compose([ Validators.email])],
      officialEmailId: [this.customer.mediaList[0].emailId=="NULL"?"":this.customer.mediaList[0].emailId, Validators.compose([ Validators.email])],
      phoneno: [this.customer.mediaList[0].mobileNo, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.minLength(10), Validators.maxLength(15)])],
      alternateNumber: [this.customer.mediaList[0].alternateMobile =="NULL"?"":this.customer.mediaList[0].alternateMobile, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.minLength(10), Validators.maxLength(15)])],
      emergencyNumber: [this.customer.mediaList[0].emergencyContactNo, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.minLength(10), Validators.maxLength(15)])],
      currentAddress: [this.customer.mediaList[0].communicationAddress, Validators.compose([Validators.minLength(1), Validators.maxLength(200)])],
      permanentAddress: [this.customer.mediaList[0].permanentAddress, Validators.compose([Validators.minLength(1), Validators.maxLength(200)])],
      maritialStatus: [this.customer.martial, Validators.compose([Validators.minLength(1), Validators.maxLength(20)])],
      spouseName: [this.customer.spouseName, Validators.compose([Validators.minLength(1), Validators.maxLength(50)])],
      bloodGroup: [this.customer.bloodGroup, Validators.compose([Validators.minLength(1), Validators.maxLength(20)])],

    });
    console.log("dateOfJoin",this.formGroup.value.dateOfJoin);
    if(this.userHRModel.employmentInfo.employmentStatus ==="Active_But_Long_Leave"){
      this.isLongLeave=true;
    }else{
      this.isLongLeave=false;
    }
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

    const sbUpdate = this.usersService.saveHR(this.userHRModel, this.hrEmp).pipe(
      tap(() => {

        this.modal.close();
        this.usersService.filterData("");

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
    this.userHRModel.employmentInfo.lastDrawnSalary = formData.lastSalaryDrawn;
    this.userHRModel.employmentInfo.esiEligible = formData.esiEligible;
    this.userHRModel.employmentInfo.resignedFAndF = formData.fnf;
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
    this.media.emergencyContactNo = formData.emergencyNumber;
    this.media.communicationAddress = formData.currentAddress;
    this.media.permanentAddress = formData.permanentAddress;
    this.media.district = formData.district;

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
    this.subscriptions.forEach(sb => !sb?sb.unsubscribe():"");
  }

  checkEmpStatus(value){

    if(value == "Active_But_Long_Leave"){
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

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
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
