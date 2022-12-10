import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  NgbActiveModal,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerConfig,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';

import { AuthService, UserModel } from '../../auth';
import { PoDetail } from '../../auth/_models/po-detail.model';
import { POLimit } from '../../auth/_models/po-limit.model';
import { ProjectService } from '../../auth/_services/project.services';
import { RoadtypeService } from '../../auth/_services/roadtype.services';


@Component({
  selector: 'app-roadtype-po-create',
  templateUrl: './roadtype-po-create.component.html',
  styleUrls: ['./roadtype-po-create.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class RoadtypePoCreateComponent implements OnInit {
  @Input() poDetailId: string;
  @Input() projectName: string;
  @Input() clientName: string;
  isLoading$;
  isAdminRole: boolean;
  poLimit:POLimit;
  formGroup: FormGroup;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;

  constructor(
    public modal: NgbActiveModal,
    private config: NgbDatepickerConfig,
    public roadTypeService: RoadtypeService,
    private snackBar: MatSnackBar,
  ) {
    this.poLimit = new POLimit();
    this.poLimit.poDetail = new PoDetail();

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
    const formData = this.formGroup.value;

    this.poLimit.poNumber = formData.poNumber;
    //this.poLimit.poDate = formData.poDate;
    this.poLimit.poLimit = formData.poLimit;
    this.poLimit.poDetail.poDetailId=this.poDetailId;

    const sbCreate = this.roadTypeService.addPOLimit(this.poLimit, "/addPOLimit").pipe(
      tap(() => {
         this.modal.close();
       }),
       catchError((errorMessage) => {
         this.modal.dismiss(errorMessage);
         return of(errorMessage);
       }),
     ).subscribe(res =>this.openSnackBar(res.messageCode?"PO Limit added Successfully":res,"!!"));

  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
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
