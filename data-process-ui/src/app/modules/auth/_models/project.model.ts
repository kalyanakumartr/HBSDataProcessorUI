import { BaseModel } from "src/app/_metronic/shared/crud-table";
import { ProjectDetails } from "./project-details.model";

export class Project implements BaseModel{
      id: any;
      projectId: string;
      projectName!:string;
      projectDetail!:ProjectDetails;
      divisionId:string;
    }
