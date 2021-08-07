
export class UserHRModel {
bankAccounts: BankAccounts;
employmentInfo:EmploymentInfo;
educationalInfo:any;
taxInfo:any;

}
export class BankAccounts {
  accountNo: string;
  bankName: any;
  bankBranch:any;
  ifscCode:any;
}

export class EmploymentInfo {
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
export class taxInfo {
  aadhar: string;
  esic: string;
  providentFund:string;
  pan:string;
  uan:string;
}
