import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  NgbActiveModal,
  NgbDatepickerConfig,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';

import { AuthService, UserModel } from '../../auth';
import { ProjectService } from '../../auth/_services/project.services';

@Component({
  selector: 'app-roadtype-create',
  templateUrl: './roadtype-create.component.html',
  styleUrls: ['./roadtype-create.component.scss'],
})
export class RoadtypeCreateComponent implements OnInit {
  @Input() poDetailId: string;
  @Input() roadId: string;
  @Input() clientName: string;
  isLoading$;
  isAdminRole: boolean;
  customer: UserModel;
  formGroup: FormGroup;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;

  constructor(
    public modal: NgbActiveModal,
    private config: NgbDatepickerConfig,
    private projectService: ProjectService,
    private authService: AuthService
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
      poNumberId: new FormControl(),
      clientName: new FormControl(),
      poDate: new FormControl(),
      poLimit: new FormControl(),
      poNumber: new FormControl(),
    });
  }

  ngOnInit(): void {}

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
  findInvalidControls() {
    throw new Error('Method not implemented.');
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
