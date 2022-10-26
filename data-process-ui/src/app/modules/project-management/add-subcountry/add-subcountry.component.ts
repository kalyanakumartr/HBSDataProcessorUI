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
import { SubCountry } from '../../auth/_models/sub-country.model';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
const EMPTY_SUBCOUNTRY: SubCountry = {
  country: '',
  countryName: '',
  displayOrder: 0,
  priority: '',
  status:'',
  value:'',
  label:''
}
@Component({
  selector: 'app-add-subcountry',
  templateUrl: './add-subcountry.component.html',
  styleUrls: ['./add-subcountry.component.scss']
})
export class AddSubcountryComponent implements OnInit {
  @Input() id: string;
  isLoading$;
  formGroup: FormGroup;
  subCountry: SubCountry;


  constructor(
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    public modal: NgbActiveModal)
    {
      this.formGroup = new FormGroup({
        countryName: new FormControl(),
        priority: new FormControl(),
        dStatus: new FormControl(),
        displayOrder: new FormControl()
          });


    }
  ngOnInit(): void {
    this.subCountry = EMPTY_SUBCOUNTRY;
   }
  findInvalidControls() {}
  save() {
    const formData = this.formGroup.value;

    this.subCountry.countryName = formData.countryName;
    this.subCountry.priority = formData.priority;
    this.subCountry.status = formData.dStatus;
    this.subCountry.displayOrder = formData.displayOrder?formData.displayOrder:101;

    const sbCreate = this.projectService.createSubCountry(this.subCountry,"/addSubCountry").pipe(
     tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(errorMessage);
      }),
    ).subscribe(res =>this.openSnackBar(res.messageCode?"Update Successful":res,"!!"));

   }
   openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
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
