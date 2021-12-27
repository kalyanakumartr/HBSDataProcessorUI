import { TaskBatch } from "./taskbatch.model";

export class UpdateTaskModel  {
  allocationIds: string[] ;
  queueId:string;
  statusId:string;
  reasonId:string;
  allotedTo:string;
  teamId:string;
  triggeredAction:string;
  skillSet:string;
  remarks:string;
  teamName:string;
  statusReason:string;
  allotmentId:string;
  allotedUserName:string;
  projectId:string;
  taskBatch:TaskBatch;

}
