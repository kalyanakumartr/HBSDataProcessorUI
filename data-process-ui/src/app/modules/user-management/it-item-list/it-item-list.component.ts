import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthModel } from '../../auth/_models/auth.model';
import { catchError, tap } from 'rxjs/operators';
import { UserSkillSetMatrixService } from '../../auth/_services/user-skillset-matrix.service';
import { of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { AddSkillSet, SkillSetMaps, UserSkillSetMatrixModel } from '../../auth/_models/user-skillset-matrix.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ItItemsModel } from '../../auth/_models/it-items.model';
import { UsersService } from '../../auth/_services/user.service';
import { ITItemModalComponent } from '../users/component/it-item-modal/it-item-modal.component';

@Component({
  selector: 'it-item-list',
  templateUrl: './it-item-list.component.html',
  styleUrls: ['./it-item-list.component.scss']
})
export class ITItemListComponent implements
OnInit,
OnDestroy,
AfterViewInit
{
@Input() id: string;
@Input() userId: string;
@Input() name: string;
@ViewChild(MatPaginator, {static: true}) paginator:MatPaginator;
@ViewChild(MatSort) sort: MatSort;
userList: any;
itItemsModel:ItItemsModel;
displayedColumns = ['slno', 'assetName','serialNo','brand','givenDate','receivedDate','remarks','Action'];
dataSource = new MatTableDataSource<ItItemsModel>();
assetList:ItItemsModel[];
isLoading$;
authModel:AuthModel;
  constructor(private fb: FormBuilder,
    public modalService: NgbModal,
    private snackBar: MatSnackBar,
    private _router: Router,
    public usersService: UsersService
    ) {
      this.usersService.listen().subscribe((m:any)=>{
        console.log("m -- -- --",m);
        this.getData(this.id);
      });
      this.itItemsModel =new ItItemsModel;
      console.log("itItemsModel", this.itItemsModel)
  }

  ngOnInit(): void {
    this.getData(this.id);
  }
  private getData(value:string) {
    this.usersService.getUserAssets(value).pipe(
      tap((res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.assetList = res;
        //this.headerList = res.headerList;
        console.log("UserAssets List", this.dataSource);
       // console.log("headerList ", this.headerList);
        this.ngAfterViewInit();
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    //this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  save(id){

    this.itItemsModel= new ItItemsModel;


        this.itItemsModel.asset.assetName =(<HTMLInputElement>document.getElementById(id+this.displayedColumns[1])).value;
        this.itItemsModel.serialNo =(<HTMLInputElement>document.getElementById(id+this.displayedColumns[2])).value;
        this.itItemsModel.brand.brandName =(<HTMLInputElement>document.getElementById(id+this.displayedColumns[3])).value;
        this.itItemsModel.givenDate =(<HTMLInputElement>document.getElementById(id+this.displayedColumns[4])).value;
        this.itItemsModel.receivedDate =(<HTMLInputElement>document.getElementById(id+this.displayedColumns[5])).value;
        this.itItemsModel.remarks =(<HTMLInputElement>document.getElementById(id+this.displayedColumns[6])).value;


  }
  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(ITItemModalComponent, { size: 'lg', animation :true });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.name = this.name;
    if(id == undefined){
      modalRef.componentInstance.itItemsModel=new ItItemsModel;
    }else{
      for(var assetObj of this.assetList){
        if(assetObj.autoId === id){
          modalRef.componentInstance.itItemsModel=assetObj;
        }
      }
    }
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }
  onSearchChange(searchValue: string): void {
    if(searchValue.length>=3){
      this.getData(searchValue);
    }
  }
  reloadCurrentRoute() {
    let currentUrl = this._router.url;
    this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this._router.navigate([currentUrl]);
        console.log(currentUrl);
    });
  }
  close(){
    this.modalService.dismissAll();
  }
}
