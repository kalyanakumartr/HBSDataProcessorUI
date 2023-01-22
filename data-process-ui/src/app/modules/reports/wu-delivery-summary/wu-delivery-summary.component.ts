import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  GroupingState,
  PaginatorState,
  SortState,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
} from '../../../_metronic/shared/crud-table';
import { AuthService, UserModel } from '../../auth';
import { AuthModel } from '../../auth/_models/auth.model';
import { ProjectService } from '../../auth/_services/project.services';
import { DeliveryTrackerService } from '../../auth/_services/delivery-tracker.service';
import { LabelValueModel } from '../../attendance/modal/value-lable.model';


@Component({
  selector: 'app-wu-delivery-summary',
  templateUrl: './wu-delivery-summary.component.html',
  styleUrls: ['./wu-delivery-summary.component.scss']
})
export class WuDeliverySummaryComponent implements OnInit,
OnDestroy,
IDeleteAction,
IDeleteSelectedAction,
IFetchSelectedAction,
IUpdateStatusForSelectedAction,
ISortView,
IFilterView,
IGroupingView,
ISearchView,
IFilterView {
paginator: PaginatorState;
sorting: SortState;
grouping: GroupingState;
isLoading: boolean;
filterGroup: FormGroup;
searchGroup: FormGroup;
userList: any;
departmentList:any[];
department:any;
divisionList:any[];
division:any;
projectList:any[];
project:any;
isClearFilter:boolean;
fromDate:any;
toDate:any;
roleId:string;
departmentName:string;
divisionName:string;
showDivision:boolean;
showDepartment:boolean;
groupTeamDefault:string;
minDate : NgbDateStruct;
maxDate : NgbDateStruct;
toMinDate : NgbDateStruct;
toMaxDate : NgbDateStruct;
monthlyList: LabelValueModel[];
isLoading$;
private subscriptions: Subscription[] = [];
authModel:AuthModel;
  constructor(private fb: FormBuilder,
    private modalService: NgbModal, public deliveryTrackerService: DeliveryTrackerService,    private authService: AuthService,public projectService: ProjectService) {
      this.deliveryTrackerService.listen().subscribe((m:any)=>{
        console.log("m -- -- --",m);
        this.filter();
      });
      this.projectList=[];
      this.divisionList=[];
      this.isClearFilter=false;
      this.showDivision=true;
      this.showDepartment=true;
      this.roleId = authService.currentUserSubject.value.roleId;
      if(this.roleId.includes('ProjectLeader')){
        this.divisionName = authService.currentUserSubject.value.operationalRecord.division.divisionName;
        this.departmentName = authService.currentUserSubject.value.operationalRecord.department.departmentName;
        this.division = authService.currentUserSubject.value.operationalRecord.division.divisionId;
        this.department = authService.currentUserSubject.value.operationalRecord.department.departmentId;
        this.showDivision=false;
        this.showDepartment=false;

      }
      if(this.roleId.includes('TeamLeader')){
        this.divisionName = authService.currentUserSubject.value.operationalRecord.division.divisionName;
        this.departmentName = authService.currentUserSubject.value.operationalRecord.department.departmentName;
        this.division = authService.currentUserSubject.value.operationalRecord.division.divisionId;
        this.department = authService.currentUserSubject.value.operationalRecord.department.departmentId;
        this.showDivision=false;
        this.showDepartment=false;
      }

  }

  ngOnInit(): void {
    //this.filterForm();
    this.searchForm();
    this.getDateRange();
    if(!this.showDivision){
      this.deliveryTrackerService.patchStateWithoutFetch({ departmentId:this.department,divisionId:this.division});
      this.getProjectForDivision();
      this.isClearFilter=true;
    }
    this.deliveryTrackerService.fetch("/deliveryCompletedReport");
    console.log("UserList :", this.subscriptions)
    this.grouping = this.deliveryTrackerService.grouping;
    this.paginator = this.deliveryTrackerService.paginator;
    this.sorting = this.deliveryTrackerService.sorting;

    const sb = this.deliveryTrackerService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    if(this.showDivision){
      this.getDepartment();
      this.division="0";
      this.department="0";
    }
    this.project="0";
  }
  private getDateRange() {
    this.deliveryTrackerService.getMonthlyDateRange().pipe(
      tap((res: any) => {
        console.log("res", res);
        this.monthlyList = res;
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  setMonth(value){
    var position =value.split("#");
    if(position.length>1){
      this.fromDate=position[0];
      this.toDate=position[1];
    }else{
      alert("Select Valid Month")
    }
  }
  public getUsers() {
    console.log("Inside get Users")
    //this.subscriptions= this.userService.getUserList();
    this.deliveryTrackerService.getUserList().subscribe(users => {
      this.subscriptions = users;
    });
    console.log(this.subscriptions );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      searchTerm: [''],
    });
    this.subscriptions.push(
      this.filterGroup.controls.status.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.type.valueChanges.subscribe(() => this.filter())
    );
  }

  filter() {
    const filter = {};
    /*const status = this.filterGroup.get('status').value;
    if (status) {
      filter['status'] = status;
    }

    const type = this.filterGroup.get('type').value;
    if (type) {
      filter['type'] = type;
    }*/
    this.deliveryTrackerService.patchState({ filter },"/deliveryCompletedReport");
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
      department:['0'],
      division:['0'],
      project:['0']
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        /*
      The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
      we are limiting the amount of server requests emitted to a maximum of one every 150ms
      */
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.deliveryTrackerService.patchState({ searchTerm },"/deliveryCompletedReport");
  }
  SearchFilter(){
    if(this.department.length<=3){
      alert("Please select Department");
      return;
    }
    if(this.division.length<=3){
      alert("Please select Division");
      return;
    }

    if(this.project.length<=5){
      alert("Please select Project");
      return;
    }

    var fromDat=this.myFunction(this.fromDate);
    var toDat=this.myFunction(this.toDate);
    if(fromDat.length<=0){
      alert("Please select From Date");
      return;
    }
    if(toDat.length<=0){
      alert("Please select To Date");
      return;
    }
    this.deliveryTrackerService.patchState({ departmentId:this.department,divisionId:this.division,projectId:this.project,fromDate:fromDat,toDate:toDat},"/exportToExcelDeliveryCompletedMonthly");
  }
  setFromDate(){

     // this.fromDate =this.myFunction(this.fromDate)

  }
  setToDate(){

     // this.toDate =this.myFunction(this.toDate)

  }
  myFunction(value){
    var todayStr ='';
    if(value != undefined){
      console.log(value.day,"Today",value.month,value.year);
      var dd = value.day;
      var mm = value.month;
      var yyyy = value.year;
      console.log(dd,mm,yyyy);
      var todayStr = dd + '/' + mm + '/' + yyyy;
      console.log("today Str",todayStr);
    }
    return todayStr;
   }

  // sorting
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.deliveryTrackerService.patchState({ sorting },"/deliveryCompletedReport");
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.deliveryTrackerService.patchState({ paginator },"/deliveryCompletedReport");
  }
  // form actions




  delete(id: number) {
    // const modalRef = this.modalService.open(DeleteCustomerModalComponent);
    // modalRef.componentInstance.id = id;
    // modalRef.result.then(() => this.userService.fetch(), () => { });
  }

  deleteSelected() {
    // const modalRef = this.modalService.open(DeleteCustomersModalComponent);
    // modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    // modalRef.result.then(() => this.userService.fetch(), () => { });
  }

  updateStatusForSelected() {
    // const modalRef = this.modalService.open(UpdateCustomersStatusModalComponent);
    // modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    // modalRef.result.then(() => this.userService.fetch(), () => { });
  }

  fetchSelected() {
    // const modalRef = this.modalService.open(FetchCustomersModalComponent);
    // modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    // modalRef.result.then(() => this.userService.fetch(), () => { });
  }
  getDepartment(){
    this.projectService.getDepartmentList().pipe(
      tap((res: any) => {
        this.departmentList = res;
        console.log("departmentList", this.departmentList)
        this.department="0: 0";

      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();

  }
  setDepartment(value){
    var position =value.split(":")
    if(position.length>1){
      this.department= position[1].toString().trim();
      if(this.department != "0"){
        this.isClearFilter=true;
        this.getDivisionForDepartment();
       // this.deliveryTrackerService.patchState({ departmentId:this.department },"/deliveryCompletedReport");
      }
    }
  }
  setDivision(value){
    var position =value.split(":")
    if(position.length>1){
      this.division= position[1].toString().trim();
      if(this.division != "0"){
        this.getProjectForDivision();
       // this.deliveryTrackerService.patchState({ divisionId:this.division },"/deliveryCompletedReport");
      }
    }
  }
  getDivisionForDepartment(){
    this.divisionList=[];
    this.projectService.getDivisionList(this.department).pipe(
      tap((res: any) => {
        this.divisionList = res;
        console.log("divisionList", this.divisionList)
        this.division="0: 0";
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  setProject(value){
    var position =value.split(":")
    if(position.length>1){
      this.project= position[1].toString().trim();

    }
  }

  getProjectForDivision(){
    this.projectList=[];
    this.projectService.getProjectList(this.division).pipe(
      tap((res: any) => {
        this.projectList = res;
        console.log("projectList", this.projectList);
        this.project="0: 0";
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  clearFilter(){
    if(this.fromDate){
      if(this.fromDate.length>0){
        this.fromDate='';
      }
    }
    if(this.isClearFilter){
      if(this.showDivision){
        this.division="0: 0";
        if(this.divisionList.length>0){
          this.divisionList.splice(0, this.divisionList.length);
        }
      }
      if(this.showDepartment){
        if(this.departmentList.length>0){
          this.departmentList.splice(0, this.departmentList.length);
        }
        this.getDepartment();

        this.project="0: 0";
        if(this.projectList.length>0){
          this.projectList.splice(0, this.projectList.length);
        }

      }else{
        this.project="0: 0";
      }

      (<HTMLInputElement>document.getElementById("searchText")).value="";
      this.deliveryTrackerService.setDefaults();
      if(this.showDepartment){
        this.deliveryTrackerService.patchState({ },"/deliveryCompletedReport");
      }else{
        this.deliveryTrackerService.patchState({ departmentId:this.department,divisionId:this.division,fromDate:this.fromDate,toDate:this.toDate},"/deliveryCompletedReport");
      }
      this.grouping = this.deliveryTrackerService.grouping;
      this.paginator = this.deliveryTrackerService.paginator;
      this.sorting = this.deliveryTrackerService.sorting;
      if(this.showDivision){
        this.department="0: 0";
      }
    }else{
      (<HTMLInputElement>document.getElementById("searchText")).value="";
    }
  }
  exportExcel(){
    if(this.department.length<=3){
      alert("Please select Department");
      return;
    }
    if(this.division.length<=3){
      alert("Please select Division");
      return;
    }

    if(this.project.length<=5){
      alert("Please select Project");
      return;
    }

  //  var fromDat=this.myFunction(this.fromDate);
  //  var toDat=this.myFunction(this.toDate);
    if(this.fromDate.length<=0){
      alert("Please select Month");
      return;
    }
    if(this.toDate.length<=0){
      alert("Please select Month");
      return;
    }
    (<HTMLInputElement>document.getElementById("exportExcel")).disabled=true;
    (<HTMLInputElement>document.getElementById("divSpinnerId")).hidden = false;
    this.deliveryTrackerService.patchStateWithoutFetch({ departmentId:this.department,divisionId:this.division,projectId:this.project,fromDate:this.fromDate,toDate:this.toDate});
    this.deliveryTrackerService.exportExcel("/exportToExcelDeliveryCompletedMonthly","Report").subscribe(
      responseObj => {
        console.log("report success", responseObj);
        var downloadURL = window.URL.createObjectURL(responseObj);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = "DeliverySummaryMonthly.xlsx";
        link.click();
        (<HTMLInputElement>document.getElementById("exportExcel")).disabled=false;
        (<HTMLInputElement>document.getElementById("divSpinnerId")).hidden = true;

      },
      error => {
        console.log("report error", error);
        (<HTMLInputElement>document.getElementById("exportExcel")).disabled=false;
        (<HTMLInputElement>document.getElementById("divSpinnerId")).hidden = true;

      }
    );

  }

}

