import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  NgbActiveModal,
  NgbDatepickerConfig,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { AuthService, UserModel } from '../../auth';
import { Project } from '../../auth/_models/project.model';
import { ProjectService } from '../../auth/_services/project.services';
const EMPTY_PROJECT: Project = {
  projectId: undefined,
  projectName: '',
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
    projectmanagerName:''
  }

}
@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
})
export class ProjectCreateComponent implements OnInit {
  @Input() projectId: string;
  @Input() projectName: string;
  isLoading$;
  isAdminRole: boolean;
  customer: UserModel;
  project: Project;
  formGroup: FormGroup;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private config: NgbDatepickerConfig,
    private fb: FormBuilder,
    public modal: NgbActiveModal
  ) {
    this.customer = new UserModel();

    const current = new Date();
    console.log(current.getFullYear(), current.getMonth(), current.getDate());
    this.minDate = {
      year: 2000,
      month: 1,
      day: 1,
    };
    this.maxDate = {
      year: current.getFullYear() - 18,
      month: current.getMonth() + 1,
      day: current.getDate(),
    };

    this.formGroup = new FormGroup({
      projectId: new FormControl(),
      clientName: new FormControl(),
      projectName: new FormControl(),
      projectType: new FormControl(),
      projectmanagerName: new FormControl(),
      projectcdate: new FormControl(),
      poNumber: new FormControl(),
      podate: new FormControl(),
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

  ngOnInit(): void {}
  findInvalidControls() {}
  save() {
    var invalid = this.findInvalidControls();
    var isValid = false; //invalid.length>0?false:true;
    if (isValid) {
      if (this.customer.id) {
        /*  this.prepareCustomer("Edit");
        this.edit();*/
      } else {
        /*this.prepareCustomer("Create");
        this.create();*/
      }
    } else {
      alert('Please add valid values for ' + invalid);
    }
  }

  loadProjectId() {
    if (!this.projectId) {
      this.project = EMPTY_PROJECT;
      //this.loadForm();
    } else {
      console.log("this.id", this.projectId);

      const sb = this.projectService.getItemById(this.projectId).pipe(
        first(),
        catchError((errorMessage) => {
          console.log("errorMessage", errorMessage);
          this.modal.dismiss(errorMessage);
          return of(EMPTY_PROJECT);
        })
      ).subscribe((project: Project) => {
        this.project = project;
        console.log(this.project);
       /* this.loadEditForm();
        this.loadForm();

        this.department=this.customer.operationalRecord.department.departmentId;
        this.division=this.customer.operationalRecord.division.divisionId;
        console.log("role",this.customer.roleId);
        this.role.roleId=this.customer.roleId;
        this.getDivisionForDepartment();
        this.getRolesForDivision();*/

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
