import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, FormControl } from '@angular/forms';
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

const EMPTY_SUBPROCESS: Process = {
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
  description: "This is a description"
}
@Component({
  selector: 'app-project-process-create',
  templateUrl: './project-process-create.component.html',
  styleUrls: ['./project-process-create.component.scss']
})
export class ProjectProcessCreateComponent implements OnInit {
  @Input() id: string;
  isLoading$;
  formGroup: FormGroup;
  process: Process;

  constructor(private projectService: ProjectService,
    private snackBar: MatSnackBar,
    public modal: NgbActiveModal) {

    this.formGroup = new FormGroup({

      processName: new FormControl(),
      billType: new FormControl(),
      displayStatus: new FormControl(),
      displayOrder: new FormControl()


    });
  }

  ngOnInit(): void {
    this.process = EMPTY_SUBPROCESS;
  }
  findInvalidControls() { }
  save() {
    const formData = this.formGroup.value;

    this.process.processName = formData.processName;
    this.process.billType = formData.billType;
    //this.process.displayOrder = formData.displayOrder;
    this.process.status = formData.displayStatus=="Active"?true:false;
    this.process.displayOrder = formData.displayOrder ? formData.displayOrder : 101;

    const sbCreate = this.projectService.createProcess(this.process, "/addProcess").pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(errorMessage);
      }),
    ).subscribe(res => this.openSnackBar(res.messageCode ? "Update Successful" : res, "!!"));

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
