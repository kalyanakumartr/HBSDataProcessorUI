import { ProjectService } from '../../auth/_services/project.services';
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginatorState } from 'src/app/_metronic/shared/crud-table';
import { RoadtypeService } from '../../auth/_services/roadtype.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { POLimit } from '../../auth/_models/po-limit.model';
import { RoadtypePoCreateComponent } from '../roadtype-po-create/roadtype-po-create.component';
//import{addProject}

@Component({
  selector: 'app-roadtype-po-list',
  templateUrl: './roadtype-po-list.component.html',
  styleUrls: ['./roadtype-po-list.component.scss']
})
export class RoadtypePoListComponent implements OnInit, OnDestroy, AfterViewInit{
  @Input() poDetailId: string;
  @Input() projectId: string;
  @Input() projectName: string;
  @Input() divisionId: string;
  @Input() clientName: string;
  @Input() roadTypeObj: any;
  paginator: PaginatorState;
  isLoading: boolean;
  sort: any;


  constructor(private fb: FormBuilder,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private _router: Router,
    public roadTypeService: RoadtypeService,

    public projectService: ProjectService
    ) { }
  displayedColumns = [ 'poNumber','poDate','poLimit','Action'];
    dataSource = new MatTableDataSource<POLimit>();



  ngOnInit(): void {
    this.getData(this.poDetailId);
  }
  private getData(value:string) {
    this.roadTypeService.getPOList(value).pipe(
      tap((res: any) => {
        this.dataSource = new MatTableDataSource(res);
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
    //this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  delete(poLimit:any){
      const sbCreate = this.roadTypeService.deletePOLimit(poLimit, "/deletePOLimit").pipe(
        tap(() => {
           this.modalService.dismissAll();
         }),
         catchError((errorMessage) => {
           this.modalService.dismissAll(errorMessage);
           return of(errorMessage);
         }),
       ).subscribe(res =>this.openSnackBar(res.messageCode?"PO Limit deleted Successfully":res,"!!"));
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
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
  createPO(){
    const modalRef = this.modalService.open(RoadtypePoCreateComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.poDetailId = this.poDetailId;
    modalRef.componentInstance.projectName = this.projectName;
    modalRef.componentInstance.clientName = this.clientName;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      console.log(receivedEntry);
      this.getData(this.poDetailId);
      })
  }

   // pagination
   paginate(paginator: PaginatorState) {
    this.projectService.patchState({ paginator }, '/podetail');
  }

  ngOnDestroy() {
    //this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
