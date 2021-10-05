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
  private subscriptions: Subscription[] = [];
  constructor(
        private snackBar: MatSnackBar,
        public workAllocationService: WorkAllocationService,
        private fb: FormBuilder, public modal: NgbActiveModal
    ) {

    }

  ngOnInit(): void {

    this.workAllocationService.getReaonsList(this.queue,"hold")
    .subscribe((reasons) => {
      this.reasonList = reasons;
    });
  }
  start(taskId){
    var allotedto ="";
    var team="";
    this.assignWorkUnits(taskId,this.queue,team,"Start","Ready",allotedto,"NOREASON");
  }

  stop(taskId){
    var allotedto ="15794";//Hardcoded
    var team="GRP0038";//Hardcoded
    this.assignWorkUnits(taskId,this.queue,team,"End","Completed",allotedto,"NOREASON");
  }
  hold(taskId){
    if(this.selectedReason == ""){
      alert("Please select Reason for Reject");
      return;
    }
    var allotedto ="";
    var team="";
    this.assignWorkUnits(taskId,this.queue,team,"Hold","InProgress",allotedto,this.selectedReason);
  }
  reject(taskId){
    if(this.selectedReason == ""){
      alert("Please select Reason for Reject");
      return;
    }
    var allotedto ="";
    var team="";
    this.assignWorkUnits(taskId,this.queue,team,"Reject","InProgress",allotedto,this.selectedReason);
  }
  getReason(value){
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
    this.workAllocationService.updateTask(updateTask)
    .subscribe((res: any)=>
    {
        this.openSnackBar(res.messageCode,"!!")
    });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }
}
