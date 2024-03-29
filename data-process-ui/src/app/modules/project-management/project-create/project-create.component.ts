import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  NgbActiveModal,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerConfig,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { AuthService, UserModel } from '../../auth';
import { Project } from '../../auth/_models/project.model';
import { ProjectService } from '../../auth/_services/project.services';
const EMPTY_PROJECT: Project = {
  id: '',
  projectId: undefined,
  projectName: '',
  divisionId: '',
  clientName: '',
  projectManagerId:'',
  templateUploadDate:'',
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
    projectManagerName:'',
    createdDate:'',
    modifiedDate:''
  },
//  uomDetail:  {
  //  unitId:''
  }


@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class ProjectCreateComponent implements OnInit {
  @Input() projectId: string;
  @Input() projectName: string;
  @Input() divisionId: string;
  isLoading$;
  isAdminRole: boolean;
  customer: UserModel;
  project: Project;
  userList:any[];
  uomList:any[];
  deliveryModeList:any[];
  deliveryTypeList:any[];
  formGroup: FormGroup;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  private subscriptions: Subscription[] = [];

  constructor(
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    private config: NgbDatepickerConfig,
    private fb: FormBuilder,
    public modal: NgbActiveModal
  ) {


    const current = new Date();


    this.formGroup = new FormGroup({
      projectId: new FormControl(),
      clientName: new FormControl(),
      projectName: new FormControl(),
      projectType: new FormControl(),
      projectmanagerName: new FormControl(),
      projectcdate: new FormControl(),
      poNumber: new FormControl(),
      poDate: new FormControl(),
      bcycle: new FormControl(),
      projectStatus: new FormControl(),
      deliverables: new FormControl(),
      moDelivery: new FormControl(),
      irMode: new FormControl(),
      inputType: new FormControl(),
      displayInOP: new FormControl(),
      tpwvol: new FormControl(),
      uom: new FormControl(),
      rwVol: new FormControl(),
      etHours: new FormControl(),
      resoueces: new FormControl(),
      noDays: new FormControl(),
      bpsDate: new FormControl(),
      bpscDate: new FormControl(),
      cecDate: new FormControl(),
      pacDate: new FormControl(),
    });

  }

  ngOnInit(): void {

    this.getUserListByRoles();
    this.getUomList();
    this.getdeliveryModeList();
    this.getdeliveryModeType();
    this.loadProjectId();


  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.formGroup.controls;
    for (const name in controls) {
     // console.log(name,"--",controls[name].invalid);
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
  }

  save() {
    /*var invalid = this.findInvalidControls();
    var isValid = invalid.length>0?false:true;
    if(isValid){*/
    if(!this.project.divisionId){
      this.project.divisionId=this.divisionId;
    }
      if (this.projectId) {
        this.prepareProject("Edit");
        this.edit();
      } else {
        this.prepareProject("Create");
        this.create();
      }
    /*}else{
      alert("Please add valid values for "+invalid);
    }*/
  }

  edit() {
    this.project.projectDetail.createdDate='';
    this.project.projectDetail.modifiedDate='';
    this.project.templateUploadDate='';
    const sbUpdate = this.projectService.update(this.project,"/updateProject","formProject").pipe(
      tap(() => {
        this.modal.close();
        this.projectService.filterData("");
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.customer);
      }),
      ).subscribe(res =>this.openSnackBar(res.messageCode?"Update Successful":res,"!!"));
    //this.subscriptions.push(sbUpdate);
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }
  getUserListByRoles(){
    var roleShortNames = ["PM", "PL"];
    this.projectService
      .getUserListByRoles(this.divisionId,roleShortNames,'')
      .pipe(
        tap((res: any) => {
          this.userList = res;
          console.log('userList', this.userList);

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
  getUomList(){
   // var roleShortNames = ["PM", "PL"];
    this.projectService
      .getUomList()
      .pipe(
        tap((res: any) => {
          this.uomList = res;
          console.log('uomList', this.uomList);

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
  getdeliveryModeList(){
    // var roleShortNames = ["PM", "PL"];
     this.projectService
       .getDeliveryModeList()
       .pipe(
         tap((res: any) => {
           this.deliveryModeList = res;
           console.log('deliveryModeList', this.deliveryModeList);

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
   getdeliveryModeType(){
    // var roleShortNames = ["PM", "PL"];
     this.projectService
       .getDeliveryTypeList()
       .pipe(
         tap((res: any) => {
           this.getdeliveryModeType = res;
           console.log('deliveryModeType', this.getdeliveryModeType);

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



  create() {
    console.log("Add Project");
    const sbCreate = this.projectService.create(this.project,"/addProject","formProject").pipe(
      tap(() => {
        this.modal.close();
        this.projectService.filterData("");
      }),
      catchError((errorMessage) => {
        this.openSnackBar(errorMessage,"X");
        return of(this.project);
      }),
    ).subscribe(res =>this.openSnackBar(res.messageCode?"Project Created Successful":res,"!!"));

    this.subscriptions.push(sbCreate);
  }

  private prepareProject(createEdit) {
    const formData = this.formGroup.value;

    this.project.projectId = formData.projectId;
    this.project.projectName = formData.projectName;
    this.project.projectDetail.clientName = formData.clientName;
    this.project.projectDetail.projectType = formData.projectType;
    this.project.projectManagerId = formData.projectmanagerName;
    //this.project.projectDetail.createdDate= formData.projectcdate; //projectCreatedDates
    //this.project.projectDetail.mo= formData.projectcdate; //projectCreatedDates

    this.project.projectDetail.poNumber = formData.poNumber;
    this.project.projectDetail.poDated = formData.poDate;
    this.project.projectDetail.billingCycle = formData.bcycle;
    this.project.projectDetail.projectStatus = formData.projectStatus;
    this.project.projectDetail.deliverables = formData.deliverables;
    this.project.projectDetail.modeOfDelivery = formData.moDelivery;
    this.project.projectDetail.inputReceivingMode = formData.irMode;
    this.project.projectDetail.inputType = formData.inputType;

    this.project.projectDetail.displayInOtherUIProjectList = formData.displayInOP;
    this.project.projectDetail.totalProjectedWorkVolume = formData.tpwvol;
    this.project.projectDetail.unitsOfMeasurement = formData.uom;
    //this.project.uomDetail.unitName=formData.uom;
    this.project.projectDetail.receivedWorkVolume = formData.rwVol;
    this.project.projectDetail.estimatedTotalHours = formData.etHours;
    this.project.projectDetail.plannedNoOfResources = formData.resoueces;
    this.project.projectDetail.noOfDaysRequiredToComplete = formData.noDays;
    this.project.projectDetail.bpsStartDate = formData.bpsDate;
    this.project.projectDetail.bpsPlannedCompletionDate = formData.bpscDate;
    this.project.projectDetail.clientExpectedCompletionDate = formData.cecDate;
    this.project.projectDetail.actualCompletedDate = formData.pacDate;



    if(createEdit == "Edit"){
      this.project.projectId=this.projectId;
    }


  }
  loadForm() {
    this.formGroup = this.fb.group({
     // projectId: [this.project.projectId, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      projectName: [this.project.projectName, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      clientName: [this.project.projectDetail.clientName, Validators.compose([ ])],
      projectType: [this.project.projectDetail.projectType, Validators.compose([])],

      projectmanagerName: [this.project.projectManagerId, Validators.compose([Validators.nullValidator])],
      projectcdate: [this.project.projectDetail.createdDate,Validators.compose([Validators.nullValidator])],
      poNumber: [this.project.projectDetail.poNumber, Validators.compose([])],
      poDate: [this.project.projectDetail.poDated, Validators.compose([Validators.nullValidator])],

      bcycle: [this.project.projectDetail.billingCycle, Validators.compose([])],
      projectStatus: [this.project.projectDetail.projectStatus, Validators.compose([])],
      deliverables: [this.project.projectDetail.deliverables, Validators.compose([])],
      moDelivery: [this.project.projectDetail.modeOfDelivery, Validators.compose([])],
      irMode: [this.project.projectDetail.inputReceivingMode, Validators.compose([])],
      inputType: [this.project.projectDetail.inputType, Validators.compose([])],
      displayInOP: [this.project.projectDetail.displayInOtherUIProjectList, Validators.compose([])],
      tpwvol: [this.project.projectDetail.totalProjectedWorkVolume, Validators.compose([])],
      rwVol: [this.project.projectDetail.receivedWorkVolume, Validators.compose([])],
      uom: [this.project.projectDetail.unitsOfMeasurement, Validators.compose([])],
      etHours: [this.project.projectDetail.estimatedTotalHours, Validators.compose([])],
      resoueces: [this.project.projectDetail.plannedNoOfResources, Validators.compose([])],
      noDays: [this.project.projectDetail.noOfDaysRequiredToComplete, Validators.compose([])],
      bpsDate: [this.project.projectDetail.bpsStartDate, Validators.compose([Validators.nullValidator])],
      bpscDate: [this.project.projectDetail.bpsPlannedCompletionDate, Validators.compose([Validators.nullValidator])],
      cecDate: [this.project.projectDetail.clientExpectedCompletionDate, Validators.compose([Validators.nullValidator])],
      pacDate: [this.project.projectDetail.actualCompletedDate, Validators.compose([Validators.nullValidator])],



    });

  }

  loadProjectId() {
    if (!this.projectId) {
      this.project = EMPTY_PROJECT;
      this.loadForm();
    } else {
      console.log("this.id", this.projectId);

      const sb = this.projectService.getProjectById(this.projectId).pipe(
        first(),
        catchError((errorMessage) => {
          console.log("errorMessage", errorMessage);
          this.modal.dismiss(errorMessage);
          return of(EMPTY_PROJECT);
        })
      ).subscribe((project: Project) => {
        this.project = project;
        console.log(this.project);
        this.loadForm();

        console.log("Check");
      });

    }
  }
  /*edit() {
  const sbUpdate = this.usersService.update(this.customer,"/updateUser","formUser").pipe(
    tap(() => {
      this.modal.close();
      this.usersService.filterData("");
    }),
    catchError((errorMessage) => {
      this.modal.dismiss(errorMessage);
      return of(this.customer);
    }),
    ).subscribe(res =>this.openSnackBar(res.messageCode?"Update Successful":res,"!!"));
  //this.subscriptions.push(sbUpdate);
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
