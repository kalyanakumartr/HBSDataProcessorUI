import { BaseModel } from "src/app/_metronic/shared/crud-table";

export class UserHRModel implements BaseModel  {
id: any;
bankAccounts: BankAccounts;
employmentInfo:EmploymentInfo;
educationalInfo:EducationalInfo;
taxInfo:TaxInfo;

}
export class BankAccounts {
  accountNo: string;
  bankName: any;
  bankBranch:any;
  ifscCode:any;
}

export class EmploymentInfo {
  dateOfJoin:any;
  infoAPL: string;
  employmentStatus:string;
  experienceInEDR:string;
  experienceOutEDR:string;
  fromNoticePeriod:any;
  toNoticePeriod:any;
  idCardEDR:string;
  lastWorkDay:any;
  lastEmployer:string;
  lastDesignation:string;
  isOfferIssued:boolean;
  isApprentice:boolean;
  isFileCreated:boolean;
  longLeaveFromDate:string;
  longLeaveToDate:string;
  longLeaveReason:string;
  approvedLeaveBalance :string;
  recruitmentType:string;
  costToCompany:string;
  vaccinateInfo:string;


}

export class EducationalInfo {
  highestGraduate: string;
  institution: string;
  markGrade:string;
  year:string;
}
export class TaxInfo {
  aadhar: string;
  esic: string;
  providentFund:string;
  pan:string;
  uan:string;
}
