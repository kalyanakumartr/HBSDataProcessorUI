import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { WorkAllocationService } from '../../auth/_services/workallocation.service';
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
  reasonList: any;
  selectedReason: string;
  showReasons:boolean = false;
  mm : any;
  ss : any;
  ms : any;
  isRunning : boolean;
  buttonType:number;
  timerId : any;
  showReject :boolean;
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
    }

  ngOnInit(): void {

    this.workAllocationService.getReaonsList(this.queue,"hold")
    .subscribe((reasons) => {
      this.reasonList = reasons;
    });
    if(this.queue != "Production"){
      this.showReject=true;
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
    this.assignWorkUnits(taskId,this.queue,team,"Start","Ready",allotedto,"NOREASON");
    this.openSnackBar("Work Unit Started","");
    this.clickHandler(2) ;
  }
  pause(taskId){
    this.clickHandler(3) ;
  }
  resume(taskId){
    this.clickHandler(2) ;
  }
  stop(taskId){
    var allotedto ="15794";//Hardcoded
    var team="GRP0038";//Hardcoded
    this.assignWorkUnits(taskId,this.queue,team,"End","Completed",allotedto,"NOREASON");
    this.openSnackBar("Work Unit Ended","");
    this.clickHandler(0) ;
    this.modal.dismiss();
  }
  hold(taskId){
    alert(this.selectedReason);
    if(this.selectedReason == undefined || this.selectedReason == ""){
      this.showReasons=true;
      (<HTMLInputElement> document.getElementById("Reject")).disabled = true;
      alert("Please select Reason for Reject");
      return;
    }
    var allotedto ="";
    var team="";
    //this.assignWorkUnits(taskId,this.queue,team,"Hold","InProgress",allotedto,this.selectedReason);
    this.openSnackBar("Work Unit Holded","");
    this.modal.dismiss();
  }
  reject(taskId){
    if(this.selectedReason == ""){
      alert("Please select Reason for Reject");
      return;
    }
    var allotedto ="";
    var team="";
    //this.assignWorkUnits(taskId,this.queue,team,"Reject","InProgress",allotedto,this.selectedReason);
    this.openSnackBar("Work Unit Rejected","");
    this.modal.dismiss();
  }
  getReason(value){
    alert(value);
    var position =value.split(":")
    this.selectedReason=position[1].toString().trim();

  }
  assignWorkUnits(taskId, queue,teamId,action,status, allotedTo,reason) {
    var updateTask= new UpdateTaskModel;

    var selectedIds = [];
    selectedIds.push(taskId);

    updateTask.allocationIds =selectedIds;
    updateTask.teamId = teamId;
    updateTask.queueId =queue;
    updateTask.statusId =status;
    updateTask.allotedTo = allotedTo;
    updateTask.eAction=action;
    updateTask.reasonId =reason;
    updateTask.remarks="To Team Member End";
   /* this.workAllocationService.updateTask(updateTask)
    .subscribe((res: any)=>
    {
        this.openSnackBar(res.messageCode,"!!")
    });*/
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
