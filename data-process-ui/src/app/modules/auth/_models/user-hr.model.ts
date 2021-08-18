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
  fromNoticePeriod:string;
  toNoticePeriod:string;
  idCardEDR:string;
  lastWorkDay:string;
  lastEmployer:string;
  lastDesignation:string;
  isOfferIssued:boolean;
  isApprentice:boolean;
  isFileCreated:boolean;
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
