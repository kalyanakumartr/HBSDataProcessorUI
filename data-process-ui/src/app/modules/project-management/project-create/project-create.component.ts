import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  NgbActiveModal,
  NgbDatepickerConfig,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { tap } from 'rxjs/operators';
import { AuthService, UserModel } from '../../auth';
import { ProjectService } from '../../auth/_services/project.services';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
})
export class ProjectCreateComponent implements OnInit {
  @Input() id: string;
  isLoading$;
  isAdminRole: boolean;
  customer: UserModel;
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
