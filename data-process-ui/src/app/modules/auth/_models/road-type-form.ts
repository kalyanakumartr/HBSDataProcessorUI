import { BaseModel } from "src/app/_metronic/shared/crud-table";
import { RoadType } from "./road-type.model";

export class RoadTypeForm implements BaseModel  {
  id: any;
  formRoadType:RoadType;
  roadTypeList:any[];

}
