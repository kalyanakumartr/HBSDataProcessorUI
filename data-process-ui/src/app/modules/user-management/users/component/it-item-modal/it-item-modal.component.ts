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
import { Asset } from 'src/app/modules/auth/_models/asset.model';
import { Brand } from 'src/app/modules/auth/_models/brand.model';


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
  @Input() userId: string;
  @Input() name: string;
  @Input() itItemsModel:ItItemsModel;
  isLoading$;
  assetList: Asset[];
  brandList: Brand[];
  assetId :string;
  brandId :string;
  receivedDate:string;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) {
      this.itItemsModel =new ItItemsModel;
      this.receivedDate="";
    }

  ngOnInit(): void {
    console.log("IT  Model",this.itItemsModel);
    this.usersService.getAssetList().pipe(
      tap((res: any) => {
        this.assetList = res;
        this.assetId ="0";
        console.log("Assets List", this.assetList);
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
      this.usersService.getBrandList().pipe(
        tap((res: any) => {
          this.brandList = res;
          this.brandId ="0";
          console.log("Brand List", this.brandList);
        }),
        catchError((err) => {
          console.log(err);
          return of({
            items: []
          });
        })).subscribe();
        this.loadITModel();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }
  loadITModel() {
    console.log("loadCustomer this.id", this.id);

    if (!this.id) {
      this.itItemsModel = EMPTY_ITMODEL;
      this.loadForm();
    } else {
      console.log("this.id", this.id);
      this.assetId = this.itItemsModel.asset.assetId;
      this.brandId = this.itItemsModel.brand.brandId;
      console.log("this.assetId", this.assetId);
      console.log("this.brandId", this.brandId);
      this.loadForm();
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      assetId: [this.itItemsModel.asset.assetId, Validators.compose([ ])],
      serialNo: [this.itItemsModel.serialNo, Validators.compose([])],
      brandId: [this.itItemsModel.brand.brandId, Validators.compose([])],
      givenDate: [this.itItemsModel.givenDate, Validators.compose([ ])],
      receivedDate: [this.itItemsModel.receivedDate , Validators.compose([ ])],
      remarks:[this.itItemsModel.remarks],


    });
  }

  save() {
    this.prepareITItem();
    if (this.itItemsModel.autoId) {
      this.edit();
    }else{
      this.add();
    }
  }

  add(){
    const sbUpdate = this.usersService.createUserAssets(this.itItemsModel, this.userId).pipe(
      tap(() => {

        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        this.openSnackBar(errorMessage,"X");
        return of(this.itItemsModel);
      }),
    ).subscribe(res =>this.openSnackBar(res.messageCode?"Created Successful":res,"!!"));
  }
  edit() {

    const sbUpdate = this.usersService.updateUserAssets(this.itItemsModel, this.userId).pipe(
      tap(() => {

        this.modal.close();
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
    alert(this.assetId + this.brandId);
    for(var asset of this.assetList){
      if(asset.assetId === this.assetId){
      this.itItemsModel.asset =asset;
      }
    }
    for(var brand of this.brandList){
      if(brand.brandId === this.brandId){
        this.itItemsModel.brand =brand;
      }
    }

    this.itItemsModel.givenDate = formData.givenDate;
    if(this.itItemsModel.givenDate.length > 6){
      this.itItemsModel.active=false;
    }else{
      this.itItemsModel.active=true;
    }
    this.itItemsModel.receivedDate = formData.receivedDate;
    this.itItemsModel.remarks = formData.remarks;
  }

  setBrand(value){
    var position =value.split(":")
    if(position.length>1){
      this.brandId= position[1].toString().trim();
    }
  }
  setAsset(value){
    var position =value.split(":")
    if(position.length>1){
      this.assetId= position[1].toString().trim();
    }
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
