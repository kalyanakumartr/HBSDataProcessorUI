import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

@Component({
  selector: 'skillset-matrix-list',
  templateUrl: './skillset-marix-obj-list.component.html',
  styleUrls: ['./skillset-marix-obj-list.component.scss']
})
export class SkillSetMatrixObjListComponent implements
OnInit,
OnDestroy,
AfterViewInit
{
@ViewChild(MatPaginator, {static: true}) paginator:MatPaginator;
@ViewChild(MatSort) sort: MatSort;
userList: any;
skillSetList:any[];
skillsetMatrixList: any[];
headerList:[];
skillSet: AddSkillSet;
displayedColumns = ['userId', 'userName','Production','QualityAssurance','QualityControl','QualityControlTrainer','Aprendices','OnlineTechSupport','QualityControlTrainee','Action', 'groupName', 'teamName'];
dataSource = new MatTableDataSource<UserSkillSetMatrixModel>();

authModel:AuthModel;
  constructor(private fb: FormBuilder,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private _router: Router,
    public userSkillSetMatrixService: UserSkillSetMatrixService
    ) {

      this.skillSet =new AddSkillSet;
      console.log("skillSet", this.skillSet)
  }

  ngOnInit(): void {
    this.getData('');
  }
  private getData(value:string) {
    this.userSkillSetMatrixService.getSkillSetMatrixList(value).pipe(
      tap((res: any) => {
        this.dataSource = new MatTableDataSource(res.items);
        this.headerList = res.headerList;
        console.log("skillsetMatrixList List", this.dataSource);
        console.log("headerList ", this.headerList);
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

    this.skillSet.skillMapList=[];
      for (let i = 0; i < this.displayedColumns.length; i++) {
      if(i >=2 && i<9){
        console.log(this.displayedColumns[i],"Value",(<HTMLInputElement>document.getElementById(id+this.displayedColumns[i])).checked);
        var skillSetMap= new SkillSetMaps;
        skillSetMap.isMapped= (<HTMLInputElement>document.getElementById(id+this.displayedColumns[i])).checked;
        skillSetMap.skillId=this.displayedColumns[i];
        this.skillSet.skillMapList.push(skillSetMap);
      }
    }

   this.skillSet.id=id;
   console.log("SkillSet",this.skillSet);
   this.userSkillSetMatrixService.saveSkillSet(this.skillSet).subscribe((res: any)=>
   {
       this.openSnackBar(res.messageCode,"!!")
   });
   this.userSkillSetMatrixService.filterData("");
   //this.getData('');
   //this.reloadCurrentRoute();
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

}
