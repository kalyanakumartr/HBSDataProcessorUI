import { Component, Input, OnInit } from '@angular/core';
import { FormGroup,FormsModule,FormBuilder,FormControl, Validators } from '@angular/forms';
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
import { SubcountryService } from '../../auth/_services/subcountry.services';
const EMPTY_SUBCOUNTRY: SubCountry = {
  country: '',
  countryName: '',
  displayOrder: 0,
  priority: '',
  status:false,
  value:'',
  label:''
}
@Component({
  selector: 'app-add-subcountry',
  templateUrl: './add-subcountry.component.html',
  styleUrls: ['./add-subcountry.component.scss']
})
export class AddSubcountryComponent implements OnInit {
  @Input() subCountry: SubCountry;
  @Input() subCountryId: string;
  isLoading$;
  isEdit:boolean;
  formGroup: FormGroup;



  constructor(
    private projectService: ProjectService,
    private subCountryService: SubcountryService,
    private snackBar: MatSnackBar,
    private fb:FormBuilder,
    public modal: NgbActiveModal)
    {
      this.isEdit=false;
      this.formGroup = new FormGroup({
        countryName: new FormControl(),
        priority: new FormControl(),
        dStatus: new FormControl(),
        displayOrder: new FormControl()
          });


    }
  ngOnInit(): void {
    this.loadProcessId()
   }
  findInvalidControls() {}
  save()
  {
    if (this.subCountryId ) {
      this.prepareProcess("Edit");
      this.edit();
    } else {
      this.prepareProcess("Create");
      this.create();
    }
  }
  private prepareProcess(createEdit) {
    const formData = this.formGroup.value;

    this.subCountry.countryName = formData.countryName;
    this.subCountry.priority = formData.priority;
    this.subCountry.status = formData.dStatus=="Active"?true:false;
    this.subCountry.displayOrder = formData.displayOrder?formData.displayOrder:101;

  }
  loadProcessId() {

    if (!this.subCountryId) {
      this.subCountry = EMPTY_SUBCOUNTRY;
    }else{
      this.isEdit=true;
    }
    this.loadForm();

  }
  loadForm() {
    this.formGroup = this.fb.group({
      countryName: [this.subCountry?this.subCountry.countryName:'', Validators.compose([])],
      priority: [this.subCountry?this.subCountry.priority:'', Validators.compose([])],
      dStatus: [this.subCountry?(this.subCountry.status==true?"Active":"Inactive"):'', Validators.compose([])],
     });
  }
  edit()
  {
    const sbUpdate = this.projectService.updateSubCountry(this.subCountry,"/updateSubCountry").pipe(
      tap(() => {
        this.modal.close();
        this.projectService.filterData("");
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.subCountry);
      }),
      ).subscribe(res =>this.openSnackBar(res.messageCode?"Update Successful":res.messageCode,"!!"));
  }

  create() {
    const sbCreate = this.projectService.createSubCountry(this.subCountry,"/addSubCountry").pipe(
     tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(errorMessage);
      }),
    ).subscribe(res =>this.openSnackBar(res.messageCode?"Create Successful":res.messageCode,"!!"));

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
