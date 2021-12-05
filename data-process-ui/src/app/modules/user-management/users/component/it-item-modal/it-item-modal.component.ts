import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { UsersService } from 'src/app/modules/auth/_services/user.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ItItemsModel } from 'src/app/modules/auth/_models/it-items.model';
import { Asset } from 'src/app/modules/auth/_models/asset.model';
import { Brand } from 'src/app/modules/auth/_models/brand.model';
import { FormControl } from '@angular/forms';


const EMPTY_ITMODEL: ItItemsModel = {

  autoId: undefined,
  serialNo:'',
  asset:{
    assetId:'0',
    assetName:'',
  },
  brand:{
    brandId:'0',
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
  selValue:string;
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
      this.selValue="0";
      this.formGroup = new FormGroup({
        assetId: new FormControl(),
        serialNo: new FormControl(),
        brandId: new FormControl(),
        givenDate: new FormControl(),
        receivedDate: new FormControl(),
        remarks: new FormControl(),

        });
    }

  ngOnInit(): void {
    console.log("IT  Model",this.itItemsModel);
    if(this.itItemsModel.autoId == undefined){
      this.itItemsModel = EMPTY_ITMODEL;
    }
    this.usersService.getAssetList().pipe(
      tap((res: any) => {
        this.assetList = res;
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
      verticalPosition:"bottom"
    });
  }
  loadITModel() {
    console.log("loadCustomer this.id", this.id);

    if (!this.id) {
      this.loadForm();
      this.setDefaultValue();
      console.log("----",this.assetId)
      this.assetId = "default";
      this.brandId = "default";
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

      assetId: [this.itItemsModel.asset.assetId == '0'?"0":this.itItemsModel.asset.assetId, Validators.compose([ ])],
      serialNo: [this.itItemsModel.serialNo, Validators.compose([])],
      brandId: [this.itItemsModel.brand.brandId == '0'?"0":this.itItemsModel.brand.brandId, Validators.compose([])],
      givenDate: [this.itItemsModel.givenDate, Validators.compose([ ])],
      receivedDate: [this.itItemsModel.receivedDate==''?null:this.itItemsModel.receivedDate , Validators.compose([ ])],
      remarks:[this.itItemsModel.remarks],


    });
    console.log("00000", this.formGroup.value);
  }
  setDefaultValue(){
    this.itItemsModel =EMPTY_ITMODEL;
    this.itItemsModel.asset.assetId="0";
    this.itItemsModel.brand.brandId="0";
    this.itItemsModel.givenDate="";
    this.itItemsModel.receivedDate="";
    this.itItemsModel.remarks="";
    this.itItemsModel.serialNo="";
  }

  save() {
    var invalid = this.findInvalidControls();
    var isValid = invalid.length>0?false:true;
    if(isValid){
      this.prepareITItem();
      if (this.itItemsModel.autoId) {
        this.edit();
      }else{
        this.add();
      }
      this.modal.dismiss();
    }else{
      alert("Please add valid values for "+invalid);
    }
  }

  add(){
    const sbUpdate = this.usersService.createUserAssets(this.itItemsModel, this.userId).pipe(
      tap(() => {
        this.usersService.filterAssetData("");
        this.modal.dismiss();
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
        this.usersService.filterAssetData("");
        this.modal.dismiss();
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
    if(this.itItemsModel.receivedDate != undefined && this.itItemsModel.receivedDate.length > 6){
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
  public findInvalidControls() {
    const invalid = [];
    const controls = this.formGroup.controls;
    for (const name in controls) {
     // console.log(name,"--",controls[name].invalid);
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
  }
}
