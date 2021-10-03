import { BaseModel } from 'src/app/_metronic/shared/crud-table';


export class SkillSetModel implements BaseModel {
  id: any;
  skillMapList: SkillSetMaps[];

}

export class SkillSetMaps {
  skillId:string;
}
