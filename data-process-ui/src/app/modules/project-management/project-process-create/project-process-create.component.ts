import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, FormControl ,Validators} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectSubcountryListComponent } from '../project-subcountry-list/project-subcountry-list.component';
import { AuthService, UserModel } from '../../auth';
import {
  NgbActiveModal,
  NgbDatepickerConfig,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from '../../auth/_services/project.services';

import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Process } from '../../time-tracker/modal/process.model';
import { ProcessService } from '../../auth/_services/process.services';

const EMPTY_SUBPROCESS: Process = {
  id:'',
  processId: '',
  process: '',
  processName: '',
  displayOrder: 0,
  billType: '',
  status: true,
  billable: true,
  entryType: "Manual",
  minutes: 0,
  skillSet: "",
  description: "This is a description",
// project:{
  // division:''
// }
}
@Component({
  selector: 'app-project-process-create',
  templateUrl: './project-process-create.component.html',
  styleUrls: ['./project-process-create.component.scss']
})
export class ProjectProcessCreateComponent implements OnInit {
  @Input() processId: string;
  @Input() process: Process;
  isEdit:boolean;



  isLoading$;
  formGroup: FormGroup;
  // process: ;


  constructor(private projectService: ProjectService,
    public processSerive:ProcessService,
    private snackBar: MatSnackBar,
    private fb:FormBuilder,
        public modal: NgbActiveModal)
    {
      this.isEdit=false;

    this.formGroup = new FormGroup({

      processName: new FormControl(),
      billType: new FormControl(),
      displayStatus: new FormControl(),
      displayOrder: new FormControl()

      // division: new FormControl(),
      // projectId: new FormControl(),



    });
  }

  ngOnInit(): void {
    // this.process = EMPTY_SUBPROCESS;
    this.loadProcessId();
  }
  loadForm() {
    this.formGroup = this.fb.group({
      processName: [this.process?this.process.processName:'', Validators.compose([])],
      billType: [this.process?this.process.billType:'', Validators.compose([])],
      displayStatus: [this.process?(this.process.status==true?"Active":"Inactive"):'', Validators.compose([])],
     });
  }

  findInvalidControls() { }
  save()
  {
    if (this.processId ) {
      this.prepareProcess("Edit");
      this.edit();
    } else {
      this.prepareProcess("Create");
      this.create();
    }
  }

  private prepareProcess(createEdit) {
    const formData = this.formGroup.value;

      this.process = new Process;
      this.process.entryType="Manual";
    if(createEdit == "Edit")    {
      this.process.processId=this.processId
    }

  this.process.processName = formData.processName;
     this.process.billType = formData.billType;
     this.process.displayOrder = formData.displayOrder?formData.displayOrder:120;
   this.process.status = formData.displayStatus=="Active"?true:false;
  }


  loadProcessId() {
    if (!this.process) {
      this.process = EMPTY_SUBPROCESS;

    }else{
    this.isEdit=true;
    }
    this.loadForm();

  }

  edit()
  {


    const sbUpdate = this.processSerive.update(this.process,"/updateProcess","formProcess").pipe(
      tap(() => {
        this.modal.close();
        this.processSerive.filterData("");
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.process);
      }),
      ).subscribe(res =>this.openSnackBar(res.messageCode?"Update Edit Successful":res,"!!"));

  }
  create()
  {

    const sbCreate = this.processSerive.create(this.process, "/addProcess","formProcess").pipe(
      tap(() => {
        this.modal.close();
        this.processSerive.filterData("");
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(errorMessage);
      }),
    ).subscribe(res => this.openSnackBar(res.messageCode ? "Update Add Successful" : res, "!!"));

  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: "top"
    });
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
}
