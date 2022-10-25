import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  NgbActiveModal,
  NgbDatepickerConfig,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { of ,Subscription} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
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
    onHoldWork: 0,
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
    clientName: '',
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
  styleUrls: ['./project-assign-roadtype.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class ProjectAssignRoadtypeComponent  implements MatSlideToggleModule, OnInit {
  @Input() projectId: string;
  @Input() roadTypeObj: any;
  @Input() divisionId: string;
  @Input() clientName: string;
  isLoading$;
  projectName:string;
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
        multiRoadNames: new FormControl(),
        roadId: new FormControl(),
        roadName: new FormControl(),
        benchMark: new FormControl(),
        multiType: new FormControl(),
        units: new FormControl(),
        dStatus: new FormControl(),
        production:new FormControl(),
        qualityControl:new FormControl(),
        modifiedDate:new FormControl()
      });

    }
  ngOnInit(): void {
    if(this.roadTypeObj){
      this.roadType = this.roadTypeObj;
      this.projectName = this.roadType.project.projectName;
    }
    this.loadRoadTypeId();
  }
  ngAfterViewInit() {


  }
  save(){
    if(!this.roadType.project.divisionId){
      this.roadType.project.divisionId=this.divisionId;
    }
    if (this.roadType) {
      this.prepareRoadTye("Edit");
      this.edit();
    } else {
      this.prepareRoadTye("Create");
      this.create();
    }
  }
  loadRoadTypeId() {
    if (!this.roadType) {
      this.roadType = EMPTY_ROADTYPE;
    }
    this.loadForm();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      projectName: [this.roadType.project.projectName, Validators.compose([])],
      roadName: [this.roadType.roadName, Validators.compose([])],
      roadId: [this.roadType.roadId, Validators.compose([])],
      multiType:[this.roadType.multiType, Validators.compose([])],
      modifiedDate:[this.roadType.milesPercentSet[0].modifiedDate, Validators.compose([])],
      clientName: [this.roadType.project.clientName, Validators.compose([])],
      benchMark: [this.roadType.milesPercentSet[0].benchMark, Validators.compose([])],
      dStatus: [this.roadType.milesPercentSet[0].status, Validators.compose([])],
      units: [this.roadType.milesPercentSet[0].units, Validators.compose([])],
      production: [this.roadType.milesPercentSet[0].production, Validators.compose([])],
      qualityControl: [this.roadType.milesPercentSet[0].qualityControl, Validators.compose([])],
    });
  }

  private prepareRoadTye(createEdit) {
    const formData = this.formGroup.value;

    this.roadType.project.projectName = formData.projectName;
    roadName: this.roadType.roadName;
    roadId: this.roadType.roadId;
    clientName: this.roadType.project.clientName;
    benchMark: this.roadType.milesPercentSet[0].benchMark;
    dStatus: this.roadType.milesPercentSet[0].status;
    units: this.roadType.milesPercentSet[0].units;
    production: this.roadType.milesPercentSet[0].production;
    qualityControl: this.roadType.milesPercentSet[0].qualityControl;


    if(createEdit == "Edit"){
      this.roadType.project.projectId=this.projectId;
    }
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }
  edit() {
    const sbUpdate = this.roadtypeService.update(this.roadType,"/updateRoadType","formRoadType").pipe(
      tap(() => {
        this.modal.close();
        this.roadtypeService.filterData("");
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.roadType);
      }),
      ).subscribe(res =>this.openSnackBar(res.messageCode?"Update Successful":res,"!!"));
    //this.subscriptions.push(sbUpdate);
  }
  create() {
    console.log("Add Road Type");
    const sbCreate = this.roadtypeService.create(this.roadType,"/addroadtype","formRoadType").pipe(
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
