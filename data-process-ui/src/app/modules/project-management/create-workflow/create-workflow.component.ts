import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { GroupTeamService } from '../../auth/_services/groupteam.services';
import { Workflow } from '../../auth/_models/workflow.model';
import { ProjectService } from '../../auth/_services/project.services';
import { Project } from '../../auth/_models/project.model';
import { WorkflowService } from '../../auth/_services/workflow.services';
const EMPTY_PROJECT: Workflow = {
//const EMPTY_PROJECT: Workflow = {

 // projectId: undefined,
  //grouptName: '',
  //divisionId: '',
  //clientName: ''

  groupId: '',
  production: '',
  qualityControl: '',
  qualityAssurance: '',
  readyForDelivery: '',
  deliveryToClient: '',

}

@Component({
  selector: 'app-create-workflow',
  templateUrl: './create-workflow.component.html',
  styleUrls: ['./create-workflow.component.scss']
})
export class CreateWorkflowComponent implements OnInit {
  divisionId:string;
  //group:Group;
    @Input() groupId: string;
  isLoading$;
  searchGroup: FormGroup;
  formGroup: FormGroup;
  group:Workflow;
  userList:any[];
  private subscriptions: Subscription[] = [];
  constructor(public modal: NgbActiveModal,
    public groupTeamService: GroupTeamService,
    private fb: FormBuilder,
    private projectService:ProjectService,
    public workflowService:WorkflowService
  ) {
    this.formGroup = new FormGroup({
      reportingManager: new FormControl(),
      groupName :new FormControl(),
      productionTeam:new FormControl(),
      qcTeam:new FormControl(),
      qaTeam:new FormControl(),
      dClient:new FormControl()
    })
  }

  ngOnInit(): void {
  }
  save(){

  }
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }



}
