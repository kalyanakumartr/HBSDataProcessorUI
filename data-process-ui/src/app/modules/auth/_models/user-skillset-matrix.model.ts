import { BaseModel } from 'src/app/_metronic/shared/crud-table';


export class UserSkillSetMatrixModel implements BaseModel {
  id: string;
  userId: string;
  userName: string;
  groupName:string;
  groupId:string;
  teamName:string;
  teamId:string;
  skillMapList: SkillSetMaps[];
  userRoleType:string;
}

export class SkillSetMaps {
  skillId:string;
  isMapped:boolean;
}

export class AddSkillSet {
  id:string;
  skillMapList: SkillSetMaps[];
}
