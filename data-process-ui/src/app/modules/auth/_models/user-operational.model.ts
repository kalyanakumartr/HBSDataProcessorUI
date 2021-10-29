import { BaseModel } from "src/app/_metronic/shared/crud-table";
import { Department } from "./department.model";
import { Deployment } from "./deployment.model";
import { Division } from "./division.model";
import { Project } from "./project.model";
import { Team } from "./team.model";

export class UserOperationalModel implements BaseModel  {
  id: any;
  team:Team;
  group:Team;
  deploy:Deployment;
  department:Department;
  division:Division;
  project:Project;
  trainingBatch:string;
  reportingTo:string;
  reportingToId:string;
  loginRFDB_BPS:string
}
