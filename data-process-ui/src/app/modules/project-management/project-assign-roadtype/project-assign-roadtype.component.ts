import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventManager } from '@angular/platform-browser';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  NgbActiveModal,
  NgbDatepickerConfig,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { of ,Subscription} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { MilesPercent } from '../../auth/_models/miles-percent.model';
import { Project } from '../../auth/_models/project.model';
import { RoadType } from '../../auth/_models/road-type.model';
import { ProjectService } from '../../auth/_services/project.services';
import { RoadtypeService } from '../../auth/_services/roadtype.services';
import {IDropdownSettings} from 'ng-multiselect-dropdown';


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
  displayOrder:0,
  // roadTyp:[]
  // roadTypeListArray:[]
  roadTypeList:[],
  // roadTyp:any,
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
  @Input() poDetailId: string;
  @Input() projectId: string;
  @Input() projectName: string;
  @Input() divisionId: string;
  @Input() clientName: string;
  @Input() roadTypeObj: any;

  confirmed: Array<RoadType>=[];
  isLoading$;
   checked:false;
  value="";
  roadType: RoadType;
  formGroup: FormGroup;
  actionBtn:string="save";
  roadTypeList:any[];
  roadList:any;

  roadTyp:string;
  // roadType:any;
  roadName:string;

dropdownList:Array<any> =[];
selectedItems:any =[];
dropdownSetting:any ={};



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
        roadTypeList:new FormControl(),
        roadTyp:new FormControl()
        // modifiedDate:new FormControl()
      });

    }
  ngOnInit(): void {
    this.getRoadList();
    this.dropdownSetting = {
      singleSelection: false,
      idField: 'roadId',
      textField: 'roadName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    if(this.roadTypeObj){
      this.roadType = this.roadTypeObj;
      this.projectName = this.roadType.project.projectName;
    }

    // this.dropdownList=[this.roadTypeList]

    this.loadRoadTypeId();
// this.dropdownSetting={
//   singleSelection:false;
// };

  }
  ngAfterViewInit() {


  }
  getRoadList()
  {
    this.roadTypeList=[];
       this.roadtypeService.getRoadTypeList(this.projectId)
         .pipe(
          tap((res: any) => {
            this.roadTypeList = res;
            console.log('roadTypeList', this.roadTypeList);
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


  save(){

    if(!this.roadType.project.divisionId){
      this.roadType.project.divisionId=this.divisionId;
    }
    if (this.roadType.roadId) {
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
    // var d;
    // this.value=d.indexOf("Multi");
  // d
  this.value=this.roadType?this.roadType.roadName:'';
    this.formGroup = this.fb.group({
      projectName: [this.roadType?this.roadType.project.projectName:'', Validators.compose([])],
      roadName: [this.roadType?this.roadType.roadName:'', Validators.compose([])],
      roadId: [this.roadType?this.roadType.roadId:'', Validators.compose([])],
      multiType:[this.roadType?this.roadType.multiType:'', Validators.compose([])],
      // modifiedDate:[this.roadType?this.roadType.milesPercentSet[0].modifiedDate:'', Validators.compose([])],
      clientName: [this.roadType?this.roadType.project.clientName:'', Validators.compose([])],
      benchMark: [this.roadType?this.roadType.milesPercentSet[0].benchMark:'', Validators.compose([])],
      dStatus: [this.roadType?(this.roadType.milesPercentSet[0].status==true?"Active":"Inactive"):'', Validators.compose([])],
      units: [this.roadType?this.roadType.milesPercentSet[0].units:'', Validators.compose([])],
      production: [this.roadType?this.roadType.milesPercentSet[0].production:'', Validators.compose([])],
      qualityControl: [this.roadType?this.roadType.milesPercentSet[0].qualityControl:'', Validators.compose([])],
      // confirmed:[this.roadType?this.roadType.roadTypeListArray:'',Validators.compose([])]
    });
  }

  private prepareRoadTye(createEdit) {
    const formData = this.formGroup.value;
    if(createEdit == "Create"){
      this.roadType = new RoadType;
      this.roadType.project = new Project;
      this.roadType.milesPercentSet =[];
    }
    var milesPercent = new MilesPercent;
    this.roadType.roadName = formData.roadName;
    this.roadType.displayOrder=1;
    milesPercent.benchMark =formData.benchMark;
    milesPercent.status =formData.dStatus=='Active'?true:false;
    milesPercent.units =formData.units;
    milesPercent.production =formData.production;
    milesPercent.qualityControl =formData.qualityControl;
    milesPercent.qualityAssurance =0;
    milesPercent.benchMark =formData.benchMark;
    this.roadType.milesPercentSet.splice(0,this.roadType.milesPercentSet.length);
    this.roadType.milesPercentSet.push(milesPercent);
    this.roadType.project.projectId=this.projectId;
    this.roadType.roadTypeList=[];

    var strArray =this.roadTyp.toString().split(",");

    for(var str in strArray){
      alert(this.roadTypeList[str]);

      this.roadType.roadTypeList.push(this.roadTypeList[str]);
    }

  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }
  edit() {
    this.roadType.milesPercentSet[0].modifiedDate=undefined;
    if(this.roadType.milesPercentSet.length>1){
      this.roadType.milesPercentSet.splice(1,this.roadType.milesPercentSet.length);
    }

    this.roadType.project.templateUploadDate=undefined
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

  public multi(event:any)
  {
    if(event.target.checked)
    {
      // alert(this.value.indexOf("abc"));
     // alert(JSON.stringify(this.value.indexOf("Mutti")));
      if(this.value.indexOf("Multi")==-1)
      {

       this.value="Multi_"+this.value;
      }
      // else
      // {

      // }
    }
    else
    {
      this.value=this.value.replace("Multi_","")

    }
  }
  create() {
    console.log("Add Road Type");
    const sbCreate = this.roadtypeService.create(this.roadType,"/addRoadType","formRoadType").pipe(
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
