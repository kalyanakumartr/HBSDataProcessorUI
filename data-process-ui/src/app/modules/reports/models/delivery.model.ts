import { BaseModel } from "src/app/_metronic/shared/crud-table";

export class DeliveryModel implements BaseModel {
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
  status:string;
  reason:string;
  queueName:string;
  allotedTo:string;
  allotedDate:string;
  processedBy:string;
  processedDate:string;
}
