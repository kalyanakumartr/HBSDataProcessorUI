import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { WorkAllocationService } from '../../auth/_services/workallocation.service';
import { WorkUnitUpdateModel } from '../modal/workunitupdate.model';
const EMPTY_WORKUNIT: WorkUnitUpdateModel = {
  dataId:'',
  workUnitId:'',
  roadTypeId:'',
  multy:false,
  multyMap : {}

}
@Component({
  selector: 'app-work-unit-edit',
  templateUrl: './work-unit-edit.component.html',
  styleUrls: ['./work-unit-edit.component.scss']
})
export class WorkUnitEditComponent implements OnInit {
  @Input() task: any;
  prodEstimatedTime:any;
  qcEstimatedTime:any;
  actualTime:any;
  roadTypeList:any;
  projectId:string;
  isMultiType:boolean;
  newRoadType:any;
  roadTypeInnerList:any;
  oldRoadType:any;
  motorwaysMiles:number;
  trunkMiles:number;
  urbanMiles:number;
  accessRampMiles:number;
  workunitUpdate:WorkUnitUpdateModel;
  constructor(
    private snackBar: MatSnackBar,
    public workAllocationService: WorkAllocationService,
    private fb: FormBuilder, public modal: NgbActiveModal
) {
  this.prodEstimatedTime=0;
  this.qcEstimatedTime=0;
  this.isMultiType=false;
  this.workunitUpdate=EMPTY_WORKUNIT;
}

ngOnInit(): void {
  this.prodEstimatedTime = this.task.coreData.roadData.roadTypeMap.benchMark.production? this.task.coreData.roadData.roadTypeMap.benchMark.production.estimatedTime:0;
  this.qcEstimatedTime = this.task.coreData.roadData.roadTypeMap.benchMark.qualityControl? this.task.coreData.roadData.roadTypeMap.benchMark.qualityControl.estimatedTime:0;
  this.isMultiType=this.task.coreData.roadData.roadTypeMap.multiType;

  this.workAllocationService.getRoadTypeList(this.projectId)
    .subscribe((reasons) => {
      this.roadTypeList = reasons;
      for(var roadType of this.roadTypeList){
        if(roadType.roadId.includes("MULTY")){
          this.roadTypeInnerList = roadType.roadTypeMap.roadTypeList;
        }
      }
      console.log("roadTypeList",this.roadTypeList);

    });
  }
  setNewRoadType(value){
    if(value.includes("MULTY")){
      this.isMultiType=true;

    }else{
      this.isMultiType=false;
    }

  }
  save(){
    if(this.newRoadType == this.oldRoadType){
      alert("Selected Road Type is Choosen already, if you want to change please select other Road Type");
    }else{
      this.workunitUpdate.dataId = this.task.coreData.dataId;
      this.workunitUpdate.workUnitId = this.task.coreData.roadData.workUnitId;
      this.workunitUpdate.roadTypeId=this.newRoadType;
      let map = new Map();
      if(this.isMultiType){

        var totalMiles=0;
        for(var roadType of this.roadTypeInnerList){
          var miles = Number((<HTMLInputElement>document.getElementById(roadType.roadId)).value);
          totalMiles=totalMiles+miles;
          map.set(roadType.roadId,miles);
        }
        if(this.task.coreData.roadData.wuMiles != totalMiles ){
          alert("Total of multy Workunit Miles is not equal to total workunit Miles");
          return;
        }

      }else{
        map.set(this.newRoadType,this.task.coreData.roadData.wuMiles);
      }
      this.workunitUpdate.multyMap =convertMapToObject(map);
      // this.workunitUpdate.oldRoadType=this.oldRoadType;
      // this.workunitUpdate.newRoadType=this.newRoadType;
      // this.workunitUpdate.multy=this.isMultiType;
      // this.workunitUpdate.motorwaysMiles=this.motorwaysMiles;
      // this.workunitUpdate.trunkMiles=this.trunkMiles;
      // this.workunitUpdate.urbanMiles=this.urbanMiles;
      // this.workunitUpdate.accessRampMiles=this.accessRampMiles;
      this.workAllocationService.updateWorkUnits(this.workunitUpdate).pipe(
        tap(() => {
          this.modal.close();
          this.workAllocationService.filterData("");
        }),
        catchError((errorMessage) => {
          this.openSnackBar(errorMessage,"X");
          return of(this.workunitUpdate);
        }),
      ).subscribe((res: string) => res =>this.openSnackBar(res == "Success"?"Work Unit Update Successful":res,"!!"));
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }
}
function convertMapToObject(metricArguments: Map<string,number>): Record<string,number> {
  let newObject: Record<string,number> = {}
  for (let [key, value] of metricArguments) {
    newObject[key] = value;
  }
  return newObject;
}
