import { DailyLog } from "./dailylog.model";
import { TimeSheetApproval } from "./time-sheet-approval.model";


export class Approval  {
  departmentId:string;
  departmentName:string;
  divisionId:string;
  divisionName:string;
  employeeId:string;
  groupId:string;
  groupName:string;
  monthYear:string;
  reportingToId:string;
  reportingTo:string;
  teamId:string;
  teamName:string;
  userName:string;
  timesheets: TimeSheetApproval[];

}


