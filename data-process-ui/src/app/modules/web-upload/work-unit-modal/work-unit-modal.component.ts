import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { WorkAllocationService } from '../../auth/_services/workallocation.service';
import { TaskBatch } from '../modal/taskbatch.model';
import { UpdateTaskModel } from '../modal/update-task.model';

@Component({
  selector: 'app-operational-user-modal',
  templateUrl: './work-unit-modal.component.html',
  styleUrls: ['./work-unit-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class WorkUnitModalComponent  {
  @Input() task: any;
  @Input() queue: any;
  @Input() status: any;
  reasonList: any;
  selectedReason: string;
  showReasons:boolean = false;
  showEditable:boolean = false;
  showQAButtons:boolean = false;
  showActionButtons:boolean = false;
  showHoldQueueButtons:boolean = false;
  mm : any;
  ss : any;
  ms : any;
  isRunning : boolean;
  buttonType:number;
  timerId : any;
  showReject :boolean;
  estimatedTime:any;
  actualTime:any;
  efficiency:any;
  remarks:any;
  private subscriptions: Subscription[] = [];
  constructor(
        private snackBar: MatSnackBar,
        public workAllocationService: WorkAllocationService,
        private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.mm = 0;
      this.ss = 0;
      this.ms = 0;
      this.isRunning = false;
      this.buttonType=1;
      this.timerId = 0;
      this.showReject=false;
      this.estimatedTime=0;
      this.actualTime=0;
      this.showEditable=false;
      this.showQAButtons=false;
      this.efficiency=0;
      this.remarks='';
    }

  ngOnInit(): void {

    if(this.queue == "Production"){
      this.estimatedTime = this.task.coreData.roadData.roadTypeMap.benchMark.production.estimatedTime;
      this.actualTime = this.task.coreData.roadData.roadTypeMap.benchMark.production.actualTime;
      if(this.estimatedTime>0 && this.actualTime>0){
        this.efficiency =this.estimatedTime/this.actualTime;
      }
      if(this.actualTime>0){
        this.buttonType=3;
      }
      this.showActionButtons=true;
    }else if(this.queue == "QualityControl"){
      this.estimatedTime = this.task.coreData.roadData.roadTypeMap.benchMark.qualityControl.estimatedTime;
      this.actualTime = this.task.coreData.roadData.roadTypeMap.benchMark.qualityControl.actualTime;
      if(this.estimatedTime>0 && this.actualTime>0){
        this.efficiency =this.estimatedTime/this.actualTime;
      }
      if(this.actualTime>0){
        this.buttonType=3;
      }
      this.showActionButtons=true;
    }else if(this.queue == "QualityAssurance"){
      this.estimatedTime = this.task.coreData.roadData.roadTypeMap.benchMark.qualityAssurance.estimatedTime;
      this.actualTime = this.task.coreData.roadData.roadTypeMap.benchMark.qualityAssurance.actualTime;
      if(this.estimatedTime>0 && this.actualTime>0){
        this.efficiency =this.estimatedTime/this.actualTime;
      }
      this.showActionButtons=false;
      this.showQAButtons=true;
    }else if(this.queue == "HoldQueue"){
      this.showActionButtons=false;
      this.showQAButtons=false;
      this.showHoldQueueButtons=true;
    }else{
      this.estimatedTime=0;
      this.actualTime=0;
      this.efficiency =0;
      this.showActionButtons=false;
    }
    if(this.status == "Hold"){
      this.showActionButtons=false;
    }
    this.mm = this.actualTime;
    this.efficiency = Math.trunc(this.efficiency*100);
    this.workAllocationService.getReaonsList(this.queue,"hold").pipe(
      tap((res: any) => {
        this.reasonList =  res;
        console.log("reasonList", this.reasonList)
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
    if(!['HoldQueue','Production'].includes(this.queue) ){
      this.showReject=true;
    }
    var statusArray: Array<string> = ['Ready', 'InProgress', 'Hold'];
    if(statusArray.indexOf(this.status) > -1){
      this.showEditable=true;
    }
    if(this.showEditable){

    }
  }
  timeLeft: number = 60;
  interval;

startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
      }
    },1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
  start(taskId){
    var allotedto ="";
    var team="";
    this.assignWorkUnits(taskId,this.queue,team,"Start","Ready",allotedto,"NOREASON",this.remarks,"");
    this.openSnackBar("Work Unit Started","");
    this.clickHandler(2) ;
  }
  pause(taskId){
    var allotedto ="";
    var team="";
    this.assignWorkUnits(taskId,this.queue,team,"Pause","InProgress",allotedto,"NOREASON",this.remarks,"");
    this.openSnackBar("Work Unit Paused","");
    this.clickHandler(3) ;
  }
  resume(taskId){
    var allotedto ="";
    var team="";
    this.assignWorkUnits(taskId,this.queue,team,"Resume","InProgress",allotedto,"NOREASON",this.remarks,"");
    this.openSnackBar("Work Unit Resume","");
    this.clickHandler(2) ;
  }
  stop(taskId){
    var allotedto ="";//Hardcoded
    var team="";//Hardcoded
    this.assignWorkUnits(taskId,this.queue,team,"Stop","Completed",allotedto,"NOREASON",this.remarks,"");
    this.openSnackBar("Work Unit Ended","");
    this.clickHandler(0) ;
    this.modal.dismiss();
  }
  hold(taskId){
    var allotedto ="";
    var team=this.task.teamId;
    this.assignWorkUnits(taskId,this.queue,team,"StartPause","Hold",allotedto,this.task.reason.reasonId,this.remarks,"");
    this.openSnackBar("Work Unit moved to Permanent Hold","");
    this.modal.dismiss();
  }
  revoke(taskId){
    var allotedto ="";
    var team=this.task.teamId;
    this.assignWorkUnits(taskId,this.queue,team,"ResumeStop","Hold",allotedto,"NOREASON",this.remarks,"");
    this.openSnackBar("Work Unit moved to from Hold","");
    this.modal.dismiss();
  }
  preHold(taskId){
    alert(this.selectedReason);
    if(this.selectedReason == undefined || this.selectedReason == ""){
      this.showReasons=true;
      (<HTMLInputElement> document.getElementById("Reject")).disabled = true;
      alert("Please select Reason for Hold");
      return;
    }
    var allotedto ="";
    var team=this.task.teamId;
    this.assignWorkUnits(taskId,this.queue,team,"Hold","InProgress",allotedto,this.selectedReason,this.remarks,"");
    this.openSnackBar("Work Unit Holded","");
    this.modal.dismiss();
  }
  batch(taskId){


    var allotedto ="";
    var team="";
    var batchId="";
    this.assignWorkUnits(taskId,this.queue,team,"StartStop","Ready",allotedto,"NOREASON",this.remarks,batchId);
    this.openSnackBar("Batch Moved to Ready for Delivery","");
    this.modal.dismiss();
  }
  currentUnit(taskId){


    var allotedto ="";
    var team="";
    this.assignWorkUnits(taskId,this.queue,team,"StartStop","Ready",allotedto,"NOREASON",this.remarks,"");
    this.openSnackBar("Work Unit Moved to Next Queue","");
    this.modal.dismiss();
  }

  reject(taskId){

    var allotedto ="";
    var team="";
    this.assignWorkUnits(taskId,this.queue,team,"Reject","InProgress",allotedto,"REJECTED",this.remarks,"");
    this.openSnackBar("Work Unit Rejected","");
    this.modal.dismiss();
  }
  getReason(value){
     this.selectedReason=value;
  }
  assignWorkUnits(taskId, queue,teamId,action,status, allotedTo,reason, remarks,batchId) {

    var updateTask= new UpdateTaskModel;
    var taskBatch= new TaskBatch;
    var selectedIds = [];
    selectedIds.push(taskId);

    if(batchId!=""){
      taskBatch.batch="Search";
    }else{
      taskBatch.batch="None";
    }
    taskBatch.batchId=batchId;
    updateTask.taskBatch=  taskBatch;
    updateTask.allocationIds =selectedIds;
    updateTask.teamId = teamId;
    updateTask.queueId =queue;
    if(queue.includes("HoldQueue")){ //Hard coded for Hold Queue alone
      updateTask.skillSet="QualityControl";
    }else{
      updateTask.skillSet=queue;
    }
    updateTask.statusId =status;
    updateTask.allotedTo = allotedTo;
    updateTask.triggeredAction=action;
    updateTask.reasonId =reason;
    updateTask.remarks=remarks;
    this.workAllocationService.updateTask(updateTask)
    .subscribe((res: any)=>
    {
        this.openSnackBar(res.messageCode,"!!");
        this.workAllocationService.filterData("");
    });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }

  refresh(){

  }


  clickHandler(type) {
    if (!this.isRunning) {
      // Stop => Running
      this.timerId = setInterval(() => {
        this.ms++;

        if (this.ms >= 100) {
          this.ss++;
          this.ms = 0;
        }
        if (this.ss >= 60) {
          this.mm++;
          this.ss = 0
        }

      }, 10);
    } else {
      clearInterval(this.timerId);
    }
    this.buttonType=type;
    this.isRunning = !this.isRunning;
  }

  format(num: number) {
    return (num + '').length === 1 ? '0' + num : num + '';
  }
}
