import { BaseModel } from "src/app/_metronic/shared/crud-table";


export class Attendance implements BaseModel {
  id: any;
  attendanceDate: string;
  shiftSelected:string;
  leaveReason:string;
  approvalStatus:string;
  remarks:string;
  billableHours:string;
  nonBillableProductiveHours:string;
  nonBillableNonProductiveHours:string;
  totalHours:string;
  otHours:string;
  approvedOtHours:string;
  discrenciesHours:string;

  }


