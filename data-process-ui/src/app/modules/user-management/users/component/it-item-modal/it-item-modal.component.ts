import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { UsersService } from 'src/app/modules/auth/_services/user.service';

import { UserITModel } from 'src/app/modules/auth/_models/user-it.model';
import { BaseModel } from 'src/app/_metronic/shared/crud-table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ItItemsModel } from 'src/app/modules/auth/_models/it-items.model';


const EMPTY_ITMODEL: ItItemsModel = {

  autoId: undefined,
  serialNo:'',
  asset:{
    assetId:'',
    assetName:'',
  },
  brand:{
    brandId:'',
    brandName:'',
  },
  givenDate:'',
  receivedDate:'',
  remarks:'',
  active:false,

};
@Component({
  selector: 'app-it-item-modal',
  templateUrl: './it-item-modal.component.html',
  styleUrls: ['./it-item-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class ITItemModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() name: string;
  isLoading$;
  itItemsModel: ItItemsModel;
  userId: BaseModel;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.itItemsModel =new ItItemsModel;
      this.userId= new UserITModel;
    }

  ngOnInit(): void {
    this.isLoading$ = this.usersService.isLoading$;
    this.userId.id=this.id;
    this.loadCustomer();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }
  loadCustomer() {
    console.log("loadCustomer this.id", this.id);

    if (!this.id) {
      this.itItemsModel = EMPTY_ITMODEL;
      this.loadForm();
    } else {
      console.log("this.id", this.id);
      const sb = this.usersService.fetchIT(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          console.log("errorMessage", errorMessage);
          return of(EMPTY_ITMODEL);
        })
      ).subscribe((itItemsModel: ItItemsModel) => {
        console.log("itItemsModel", itItemsModel);
        this.itItemsModel = itItemsModel;
        this.loadForm();
      });

    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      serialNo: [this.itItemsModel.serialNo, Validators.compose([ Validators.minLength(3), Validators.maxLength(100)])],
      brand: [this.itItemsModel.brand, Validators.compose([ Validators.minLength(3), Validators.maxLength(100)])],
      givenDate: [this.itItemsModel.givenDate, Validators.compose([ Validators.minLength(3), Validators.maxLength(100)])],
      receivedDate: [this.itItemsModel.receivedDate ],
      remarks:[this.itItemsModel.remarks],


    });
  }

  save() {
    this.prepareITItem();
    if (this.userId.id) {
      this.edit();
    }
  }

  edit() {

    const sbUpdate = this.usersService.saveITItem(this.itItemsModel, this.userId).pipe(
      tap(() => {

        this.modal.close();
        this.usersService.filterData("");

      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        this.openSnackBar(errorMessage,"X");
        return of(this.itItemsModel);
      }),
    ).subscribe(res =>this.openSnackBar(res.messageCode?"Update Successful":res,"!!"));

  }


  private prepareITItem() {
    const formData = this.formGroup.value;
    this.itItemsModel.serialNo = formData.serialNo;
    this.itItemsModel.brand =formData.brand;
    this.itItemsModel.givenDate = formData.givenDate;
    this.itItemsModel.receivedDate = formData.returnDate;
    this.itItemsModel.remarks = formData.desc;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
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
