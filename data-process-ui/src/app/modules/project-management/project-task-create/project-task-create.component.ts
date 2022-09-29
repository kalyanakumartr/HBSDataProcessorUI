import { Component, OnInit ,Input} from '@angular/core';
import { FormGroup,FormsModule,FormBuilder,FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectTaskListComponent } from '../project-task-list/project-task-list.component';

import { AuthService, UserModel } from '../../auth';
import {
  NgbActiveModal,
  NgbDatepickerConfig,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from '../../auth/_services/project.services';


@Component({
  selector: 'app-project-task-create',
  templateUrl: './project-task-create.component.html',
  styleUrls: ['./project-task-create.component.scss']
})
export class ProjectTaskCreateComponent implements OnInit {
  @Input() id: string;
  isLoading$;
  isAdminRole: boolean;
  customer: UserModel;
  formGroup: FormGroup;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;

  constructor( private projectService: ProjectService,
    private authService: AuthService,
    private config: NgbDatepickerConfig,
    private fb: FormBuilder,
    public modal: NgbActiveModal)
    {
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
    });
   }

  ngOnInit(): void {
  }
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
