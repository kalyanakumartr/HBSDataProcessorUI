import { BaseModel } from "src/app/_metronic/shared/crud-table";

export class Workflow implements BaseModel {
  id:any;
  groupId: string;
  production: string;
  divisionId:string;
  qualityControl: string;
  qualityAssurance: string;
  readyForDelivery: string;
  deliveryToClient: string;
}
