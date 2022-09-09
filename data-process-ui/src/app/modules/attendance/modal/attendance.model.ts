import { Employee } from "./employee.model";


export class AttendanceModel  {
  mode:string;
  approvedTime: string;
  attendanceId: any;
  comments:string;
  date:string;
  eventTrack:string;
  holidayName:string;
  ipAddress:string;
  markedTime:string;
  lockStatus:string;
  status:string;
  symbol:string;
  employee:Employee;
  markedBy:Employee;
  payRollLocked:boolean;
  approvedBy:Employee;
}


