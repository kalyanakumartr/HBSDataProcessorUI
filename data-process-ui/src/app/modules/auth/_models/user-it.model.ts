import { BaseModel } from "src/app/_metronic/shared/crud-table";

export class UserITModel implements BaseModel {
id: any;
broadBandAccount:string;
broadBandBy:string;
internetPlan:string;
isDowngraded:boolean;
ispName:string;
staticIPAddress:string;
staticWhiteList:boolean;
systemSerialNo:string;
systemToHome:boolean;
workMode:string;
}
