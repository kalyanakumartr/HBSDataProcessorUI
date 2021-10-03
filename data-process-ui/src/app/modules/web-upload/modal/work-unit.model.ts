import { BaseModel } from "src/app/_metronic/shared/crud-table";
import { CoreData } from "./core-data.model";


export class WorkUnitModel implements BaseModel {
  id: string;
  allocationId: string;
  coreData: CoreData;
  duration: string;
  queue: string;
  reason:string;
  remarks: string;
  allotedTo: string;
  teamName: string;
  reasonName: string;
  processedBy: string;
  groupName: string;
  startTime: string;
  processedDate: string;
  endTime: string;
  allotedDate: string;
  status: string;

}
