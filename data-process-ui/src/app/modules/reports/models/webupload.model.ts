import { BaseModel } from "src/app/_metronic/shared/crud-table";

export class WebUpload implements BaseModel {
  id: string;
  serialNo:number;
  receivedDate:string;
  group:string;
  projectCode:string;
  workUnitId:string;
  subCountry:string;
  miles:string;
  remarks:string;
  roadTypeClassification:string;
  primaryNonDividedRoadMotorways:string;
  primaryNonDividedRoadTrunk:string;
  primaryNonDividedRoadUrban:string;
  accessRamp:string;
}
