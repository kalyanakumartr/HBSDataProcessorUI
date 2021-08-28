import { BaseModel } from "src/app/_metronic/shared/crud-table";

export class RoleModel implements BaseModel {
  id: string;
  roleId:string;
  isAdminRole:boolean;
}
