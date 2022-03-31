import { DailyLog } from "./dailylog.model";


export class DailyActivities  {
  date:string;
  actualTime:string;
  totalBillable:string;
  totalNBNP:string;
  totalNBP:string;
  totalNB:string;
  total:string;
  max24Hours:string;
  overTimeHours:string;
  shortageHours:string;
  attendanceHours:string;
  dailyLogList: DailyLog[];
  editable:boolean;
}


