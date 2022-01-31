import { DailyLog } from "./dailylog.model";


export class DailyActivities  {
  date:string;
  actualTime:number;
  sumTotalBillable:number;
  sumTotalNonBillable:number;
  sumTotal:number;
  overTimeHours:number;
  shortageHours:number;
  attendanceHours:number;
  dailyLogList: DailyLog[];
  editable:boolean;
}


