import { BaseModel } from "src/app/_metronic/shared/crud-table";


export class Attendance implements BaseModel {
  id: string;
  allocationId: string;
  duration: string;
  actualTime: string ="0";
  efficiency:string ="0";
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
