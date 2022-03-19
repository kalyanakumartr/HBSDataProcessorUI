import { AttendanceModel } from "./attendance.model";
import { Employee } from "./employee.model";


export class TimeSheetModel  {
  approvedTime: string;
  timesheetId: any;
  billType:string;
  comments:string;
  eventTrack:string;
  hoursBillable:number;
  hoursNBNP:number;
  hoursNBP:number;
  lockStatus:string;
  markedTime:string;
  status:string;
  markedHours:number;
  attendance:AttendanceModel;
  approvedBy:Employee;
  totalHours:number;
  discrepencies:number;
}


