import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  NgbActiveModal,
  NgbDatepickerConfig,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { of ,Subscription} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RoadType } from '../../auth/_models/road-type.model';
import { ProjectService } from '../../auth/_services/project.services';
import { RoadtypeService } from '../../auth/_services/roadtype.services';


//const EMPTY_PROJECT: Project = {
 // divisionId: '',
  //projectId: undefined,
//}

const EMPTY_ROADTYPE: RoadType = {
  id: '',
  miles: '',
  benchMark: '',
  roadId: '',
  roadName: '',
  multiType: true,
  milesPercentSet: [],
  multiRoadNames: '',
  poDetail:{
    approvedLimit: 0,
    deliveredWork: 0,
    limitSet : {},
    onHoldWor: 0,
    pendingWork : 0,
    poDetailId: '',
    receivedInput: '',
    poDifference : 0
  },
  project:{
    id: '',
    projectId: undefined,
    projectName: '',
    divisionId: '',
    projectDetail: {
      actualCompletedDate:'',
      billingCycle:'',
      bpsPlannedCompletionDate:'',
      bpsStartDate:'',
      clientExpectedCompletionDate:'',
      clientName:'',
      deliverables:'',
      displayInOtherUIProjectList:'',
      estimatedTotalHours:'',
      inputReceivingMode:'',
      inputType:'',
      modeOfDelivery:'',
      noOfDaysRequiredToComplete:'',
      plannedNoOfResources:'',
      poDated:'',
      poNumber:'',
      projectStatus:'',
      projectType:'',
      receivedWorkVolume:'',
      totalProjectedWorkVolume:'',
      unitsOfMeasurement:'',
      projectmanagerName:'',
      createdDate:''
    }
  }

  }

@Component({
  selector: 'app-project-assign-roadstype',
  templateUrl: './project-assign-roadtype.component.html',
  styleUrls: ['./project-assign-roadtype.component.scss']
})
export class ProjectAssignRoadtypeComponent  implements MatSlideToggleModule, OnInit {
  @Input() projectId: string;
  @Input() divisionId: string;
  @Input() projectName: string;
  isLoading$;

  roadType: RoadType;
  formGroup: FormGroup;
  actionBtn:string="save";
  private subscriptions: Subscription[] = [];

  constructor(private modalService: NgbModal,
    public modal: NgbActiveModal,
    private projectService: ProjectService,
    private roadtypeService:  RoadtypeService,
    private snackBar: MatSnackBar,
    private config: NgbDatepickerConfig,
    private fb: FormBuilder,
   )
    {

      this.formGroup = new FormGroup({
        division: new FormControl(),
        projectId: new FormControl(),
        clientName: new FormControl(),
        projectName: new FormControl(),
        workArea: new FormControl(),
        benchmarkTime: new FormControl(),
        tickMultyRoadType: new FormControl(),
        units: new FormControl(),
        dStatus: new FormControl(),
        productionBenchmark:new FormControl(),
        qcBenchmark:new FormControl(),
        benchmarkUpdatedDate:new FormControl(),
        poApprovedLimit:new FormControl(),
        receivedInput:new FormControl(),
        poDifference:new FormControl(),
        delieveredWork:new FormControl(),
        onHoldWork:new FormControl(),
        pendingWork:new FormControl()



      });

    }
  ngOnInit(): void {
  }
  save(){
 if(!this.roadType.project.divisionId){
      this.roadType.project.divisionId=this.divisionId;
    }
  }
  loadProjectId() {
    if (!this.projectId) {
      this.roadType = EMPTY_ROADTYPE;
      this.loadForm();
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      projectName: [this.roadType.project.projectName, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])]
    });
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }

  create() {
    console.log("Add Road Type");
    const sbCreate = this.roadtypeService.create(this.roadType,"/addroadtype","formProject").pipe(
      tap(() => {
        this.modal.close();
        this.projectService.filterData("");
      }),
      catchError((errorMessage) => {
        this.openSnackBar(errorMessage,"X");
        return of(this.roadType.project);
      }),
    ).subscribe(res =>this.openSnackBar(res.messageCode?"Road Type Created Successful":res,"!!"));

    this.subscriptions.push(sbCreate);
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
