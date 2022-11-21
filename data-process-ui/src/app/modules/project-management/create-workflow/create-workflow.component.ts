import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap, first } from 'rxjs/operators';
//import { catchError, , tap } from 'rxjs/operators';
import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { GroupTeamService } from '../../auth/_services/groupteam.services';
import { Workflow } from '../../auth/_models/workflow.model';
import { ProjectService } from '../../auth/_services/project.services';
import { Project } from '../../auth/_models/project.model';
import { WorkflowService } from '../../auth/_services/workflow.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserModel } from '../../auth';
const EMPTY_WORKFLOW: Workflow = {

  id: '',
  allotmentId:'',
  divisionId: '',
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
  @Input() divisionId: string;
  @Input() workflowId: string;
  isLoading$;
  customer: UserModel;
 // group:Workflow;
  searchGroup: FormGroup;
  formGroup: FormGroup;
  workflow: Workflow;
  groupList: any[];
  allotmentId: any[];
  productionTeamList: any[];
  qualityAssuranceTeamList: any[];
  qualityControlTeamList: any[];
  deliveryToClientTeamList: any[];

  userList: any[];
  private subscriptions: Subscription[] = [];
  constructor(public modal: NgbActiveModal,
    public groupTeamService: GroupTeamService,
    private fb: FormBuilder,
    private projectService: ProjectService,
    public workflowService: WorkflowService,
    private snackBar: MatSnackBar,
  ) {
    this.formGroup = new FormGroup({

      groupName: new FormControl(),
      productionTeam: new FormControl(),
      qcTeam: new FormControl(),
      qaTeam: new FormControl(),
      dClient: new FormControl()
    })
  }

  ngOnInit(): void {
    this.loadWorkflow();
    this.getGroupList();
    this.getProductionTeamList();
    this.getQcTeamList();
    this.getQaTeamList();
    this.getDeliveryToClientTeamList();
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.formGroup.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  loadWorkflow() {
    if (!this.workflowId) {
      this.workflow = EMPTY_WORKFLOW;
      this.loadForm();
    } else {
      const sb = this.groupTeamService.getAllocationGroup(this.workflowId).pipe(
        first(),
        catchError((errorMessage) => {
          console.log("errorMessage", errorMessage);
          this.modal.dismiss(errorMessage);
          return of(EMPTY_WORKFLOW);
        })
      ).subscribe((workflow:Workflow) => {
        this.workflow = workflow;
        console.log(this.workflow);
        this.loadForm();

        console.log("Check");
      });

    }
    }
  loadForm() {
    this.formGroup = this.fb.group({
      groupName: [this.workflow.groupId, Validators.compose([Validators.required])],
      productionTeam: [this.workflow.production, Validators.compose([Validators.required])],
      qcTeam: [this.workflow.qualityControl, Validators.compose([Validators.required])],
      qaTeam: [this.workflow.qualityAssurance, Validators.compose([Validators.required])],
      dClient: [this.workflow.deliveryToClient, Validators.compose([Validators.required])],

    })
  }


  getGroupList() {
    this.groupList = [];
    this.projectService
      .getGroupList(this.divisionId)
      .pipe(
        tap((res: any) => {
          this.groupList = res;
          console.log('groupList1', this.groupList);

        }),
        catchError((err) => {
          console.log(err);
          return of({
            items: [],
          });
        })
      )
      .subscribe();
  }
  getQcTeamList() {
    this.groupList = [];
    this.groupTeamService
      .getTeamListBasedOnSkill("QualityControl", undefined)
      .pipe(
        tap((res: any) => {
          this.qualityControlTeamList = res;
          console.log('qualityControlTeamList', this.qualityControlTeamList);
          //setTimeout(() => {
          //this.project = '0: 0';
          //}, 2000);
        }),
        catchError((err) => {
          console.log(err);
          return of({
            items: [],
          });
        })
      )
      .subscribe();



  }



  getDeliveryToClientTeamList() {
    this.groupList = [];
    this.groupTeamService
      .getTeamListBasedOnSkill("DeliveryToClient", undefined)
      .pipe(
        tap((res: any) => {
          this.deliveryToClientTeamList = res;
          console.log('deliveryToClientTeamList', this.deliveryToClientTeamList);
          //setTimeout(() => {
          //this.project = '0: 0';
          //}, 2000);
        }),
        catchError((err) => {
          console.log(err);
          return of({
            items: [],
          });
        })
      )
      .subscribe();
  }




  getQaTeamList() {
    this.groupList = [];
    this.groupTeamService
      .getTeamListBasedOnSkill("QualityAssurance", undefined)
      .pipe(
        tap((res: any) => {
          this.qualityAssuranceTeamList = res;
          console.log('qualityAssuranceTeamList', this.qualityAssuranceTeamList);
          //setTimeout(() => {
          //this.project = '0: 0';
          //}, 2000);
        }),
        catchError((err) => {
          console.log(err);
          return of({
            items: [],
          });
        })
      )
      .subscribe();
  }





  getProductionTeamList() {
    this.groupList = [];
    this.groupTeamService
      .getTeamListBasedOnSkill("Production", undefined)
      .pipe(
        tap((res: any) => {
          this.productionTeamList = res;
          console.log('productionTeamList', this.productionTeamList);
          //setTimeout(() => {
          //this.project = '0: 0';
          //}, 2000);
        }),
        catchError((err) => {
          console.log(err);
          return of({
            items: [],
          });
        })
      )
      .subscribe();
  }

  edit() {
    this.workflow.id=undefined;
    this.workflow.readyForDelivery=this.workflow.deliveryToClient;
    const sbUpdate = this.workflowService.update(this.workflow, "/updateAllocationGroup", "formGroup").pipe(
      tap(() => {
        this.modal.close();
        this.workflowService.filterData("");
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.customer);
      }),
    ).subscribe(res => this.openSnackBar(res.messageCode ? "Workflow Update Successful" : res, res.messageCode +"!!"));
    //this.subscriptions.push(sbUpdate);
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: "top"
    });
  }




  create() {
    console.log("Add Workflow");
    this.workflow.id=undefined;
    this.workflow.allotmentId=undefined;
    this.workflow.readyForDelivery=this.workflow.deliveryToClient;
    const sbCreate = this.workflowService.create(this.workflow, "/addAllocationGroup", "formGroup").pipe(
      tap(() => {
        this.modal.close();
        this.workflowService.filterData("");
      }),
      catchError((errorMessage) => {
        this.openSnackBar(errorMessage, "X");
        return of(this.workflow);
      }),
    ).subscribe(res => this.openSnackBar(res.messageCode ? "Workflow Created Successful" : res, "!!"));

    this.subscriptions.push(sbCreate);
  }

  private prepareGroup(createEdit) {
    const formData = this.formGroup.value;

    this.workflow.groupId = formData.groupName;
    this.workflow.production = formData.productionTeam;
    this.workflow.qualityControl = formData.qcTeam;
    this.workflow.qualityAssurance = formData.qaTeam;
    // this.group.readyForDelivery = formData.readyForDelivery;
    this.workflow.deliveryToClient = formData.dClient;



    if (createEdit == "Edit") {
      this.workflow.allotmentId=this.workflowId;
    }

  }
  save(){
    if (!this.workflow.divisionId) {
      this.workflow.divisionId = this.divisionId
    }
    if (this.workflowId) {
      this.prepareGroup("Edit");
      this.edit();
    } else {
      this.prepareGroup("Create");
      this.create();
    }
  }

  /*save() {
    var workObj : any={groupId:'',production:'',qualityControl:'',qualityAssurance:'',deliveryToClient:''};
    const formData = this.formGroup.value;
    workObj.groupId = formData.groupName;
    /*this.workflow.groupId!=""?this.workflow.groupId:null;
    //workObj.teamName = formData.groupName;
    workObj.production=formData.production;
    workObj.qualityControl=formData.qualityControl;
    workObj.qualityAssurance=formData.qualityAssurance;

    //workObj.status = formData.dStatus=="Active"?true:false;
console.log("groupId",this.workflow.allotmentId);
var path ='';
  if(this.workflow.allotmentId!=""){
    path ="/updateAllocationGroup";
  }else{
    path ="/addAllocationGroup";
  }
    const sbCreate = this.workflowService.updateWorkflowTeam(workObj, this.divisionId,formData, path).pipe(
      tap(() => {
        this.modal.close();
        this.workflowService.filterData("");
      }),
      catchError((errorMessage) => {
        this.openSnackBar(errorMessage, "X");
        return of(this.workflow);
      }),
    ).subscribe(res => this.openSnackBar(res.messageCode ? "Workflow Created Successful" : res, "!!"));
    }
      openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: 4000,
          verticalPosition:"top"
        });


  }*/

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
