import { DailyLog } from "./dailylog.model";


export class DailyActivities  {
  date:string;
  actualTime:string;
  sumTotalBillable:string;
  sumTotalNonBillable:string;
  sumTotal:string;
  max24Hours:string;
  overTimeHours:string;
  shortageHours:string;
  attendanceHours:string;
  dailyLogList: DailyLog[];
  editable:boolean;
}


