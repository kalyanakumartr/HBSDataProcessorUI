import { BaseModel } from "src/app/_metronic/shared/crud-table";
import { CoreData } from "./core-data.model";


export class WorkUnitUpdateModel  {
  dataId:string;
  workUnitId: string;
  roadTypeId: string;
  multy: boolean;
  multyMap:Record<string, number>;//Map<string, number>;// {[key: string]: number};


}
