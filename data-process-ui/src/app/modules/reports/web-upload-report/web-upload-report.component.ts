import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common'
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
import { UsersService } from '../../auth/_services/user.service';
import { AuthModel } from '../../auth/_models/auth.model';
import { ProjectService } from '../../auth/_services/project.services';
import { WebuploadReportService } from '../../auth/_services/webupload-report.services';
@Component({
  selector: 'app-web-upload-report',
  templateUrl: './web-upload-report.component.html',
  styleUrls: ['./web-upload-report.component.scss']
})
export class WebUploadReportComponent implements
  OnInit,
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
  groupList:any[];
  group:string;
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
  isLoading$;
  private subscriptions: Subscription[] = [];
  authModel:AuthModel;
    constructor(private fb: FormBuilder,
      private modalService: NgbModal, public webUploadService: WebuploadReportService,    private authService: AuthService,public projectService: ProjectService) {
        this.webUploadService.listen().subscribe((m:any)=>{
          console.log("m -- -- --",m);
          this.filter();
        });
        this.projectList=[];
        this.divisionList=[];
        this.isClearFilter=false;
        this.showDivision=true;
        this.showDepartment=true;
        this.roleId = authService.currentUserSubject.value.roleId;
        if(this.roleId.endsWith('ProjectLeader')){
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
      if(!this.showDivision){
        this.webUploadService.patchStateWithoutFetch({ departmentId:this.department,divisionId:this.division});
        this.getProjectForDivision();
        this.isClearFilter=true;
      }
      this.webUploadService.fetch("/webUploadReport");
      console.log("UserList :", this.subscriptions)
      this.grouping = this.webUploadService.grouping;
      this.paginator = this.webUploadService.paginator;
      this.sorting = this.webUploadService.sorting;

      const sb = this.webUploadService.isLoading$.subscribe(res => this.isLoading = res);
      this.subscriptions.push(sb);
      if(this.showDivision){
        this.getDepartment();
        this.division="0";
        this.department="0";
      }
      this.project="0";
    }
    public getUsers() {
      console.log("Inside get Users")
      //this.subscriptions= this.userService.getUserList();
      this.webUploadService.getUserList().subscribe(users => {
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
      this.webUploadService.patchState({ filter },"/webUploadReport");
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
      this.webUploadService.patchState({ searchTerm },"/webUploadReport");
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
      this.webUploadService.patchState({ departmentId:this.department,divisionId:this.division,projectId:this.project,groupId:this.group,fromDate:fromDat,toDate:toDat},"/webUploadReport");
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
      this.webUploadService.patchState({ sorting },"/webUploadReport");
    }

    // pagination
    paginate(paginator: PaginatorState) {
      this.webUploadService.patchState({ paginator },"/webUploadReport");
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
         // this.webUploadService.patchState({ departmentId:this.department },"/webUploadReport");
        }
      }
    }
    setDivision(value){
      var position =value.split(":")
      if(position.length>1){
        this.division= position[1].toString().trim();
        if(this.division != "0"){
          this.getProjectForDivision();
          this.getGroupForDivision();
         // this.webUploadService.patchState({ divisionId:this.division },"/webUploadReport");
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
    getGroupForDivision(){
      this.groupList=[];
      this.projectService.getGroupList(this.division).pipe(
        tap((res: any) => {
          this.groupList = res;
          console.log("groupList", this.groupList)
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
    setGroup(value){
      var position =value.split(":")
      if(position.length>1){
        this.group= position[1].toString().trim();

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
          this.group="0: 0";
          if(this.groupList.length>0){
            this.groupList.splice(0, this.groupList.length);
          }
        }else{
          this.project="0: 0";
          this.group="0: 0";
        }

        (<HTMLInputElement>document.getElementById("searchText")).value="";
        this.webUploadService.setDefaults();
        if(this.showDepartment){
          this.webUploadService.patchState({ },"/webUploadReport");
        }else{
          this.webUploadService.patchState({ departmentId:this.department,divisionId:this.division,fromDate:this.fromDate,toDate:this.toDate},"/webUploadReport");
        }
        this.grouping = this.webUploadService.grouping;
        this.paginator = this.webUploadService.paginator;
        this.sorting = this.webUploadService.sorting;
        if(this.showDivision){
          this.department="0: 0";
        }
      }else{
        (<HTMLInputElement>document.getElementById("searchText")).value="";
      }
    }
    exportExcel(){
      this.webUploadService.exportExcel("/exportToExcelWebUpload","Report").subscribe(
        responseObj => {
          console.log("report success", responseObj);
          var downloadURL = window.URL.createObjectURL(responseObj);
          var link = document.createElement('a');
          link.href = downloadURL;
          link.download = "WebUpload.xlsx";
          link.click();

        },
        error => {
          console.log("report error", error);


        }
      );

    }

}
