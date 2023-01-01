import { BaseModel } from "src/app/_metronic/shared/crud-table";

export class Process implements BaseModel {
  id:string;
  processId: string;
  process: string;
  processName: string;
  displayOrder: number;
  billType: string;
  status: boolean;
  billable: boolean;
  entryType: string;
  minutes: number;
  skillSet: string;
  description: string;
}
