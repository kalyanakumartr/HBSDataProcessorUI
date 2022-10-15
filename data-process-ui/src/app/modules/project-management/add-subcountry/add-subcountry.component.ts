import { Component, Input, OnInit } from '@angular/core';
import { FormGroup,FormsModule,FormBuilder,FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectSubcountryListComponent } from '../project-subcountry-list/project-subcountry-list.component';
import { AuthService, UserModel } from '../../auth';
import {
  NgbActiveModal,
  NgbDatepickerConfig,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from '../../auth/_services/project.services';

@Component({
  selector: 'app-add-subcountry',
  templateUrl: './add-subcountry.component.html',
  styleUrls: ['./add-subcountry.component.scss']
})
export class AddSubcountryComponent implements OnInit {
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
      subCountryId: new FormControl(),
      /*department: new FormControl(),
      projectId: new FormControl(),
      division: new FormControl(),
      clientName: new FormControl(),
      projectName: new FormControl(),*/
      SubCountryname: new FormControl(),
      Priority: new FormControl(),
      dStatus: new FormControl(),
        });


    }
  ngOnInit(): void {  }
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
