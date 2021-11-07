import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { EditUserModalComponent } from '../users/component/edit-user-modal/edit-user-modal.component';
import { UserITModalComponent } from '../users/component/user-it-modal/user-it-modal.component';
import { UserHRModalComponent } from '../users/component/user-hr-modal/user-hr-modal.component';
import { OperationalUserModalComponent } from '../users/component/operational-user-modal/operational-user-modal.component';
import { ProjectService } from '../../auth/_services/project.services';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements
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
department:string;
divisionList:any[];
division:string;
projectList:any[];
project:string;
isClearFilter:boolean;
private subscriptions: Subscription[] = [];
authModel:AuthModel;
  constructor(private fb: FormBuilder,
    private modalService: NgbModal, public userService: UsersService,public projectService: ProjectService) {
      this.userService.listen().subscribe((m:any)=>{
        console.log("m -- -- --",m);
        this.filter();
      });
      this.projectList=[];
      this.divisionList=[];
      this.isClearFilter=false;
  }

  ngOnInit(): void {
    //this.filterForm();
    this.searchForm();

    this.userService.fetch("/searchUser");
    console.log("UserList :", this.subscriptions)
    this.grouping = this.userService.grouping;
    this.paginator = this.userService.paginator;
    this.sorting = this.userService.sorting;
    const sb = this.userService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.getDepartment();
    this.division="0";
    this.department="0";
    this.project="0";
  }
  public getUsers() {
    console.log("Inside get Users")
    //this.subscriptions= this.userService.getUserList();
    this.userService.getUserList().subscribe(users => {
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
    this.userService.patchState({ filter },"/searchUser");
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
      department:[''],
      division:[''],
      project:['']
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
    this.userService.patchState({ searchTerm },"/searchUser");
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
    this.userService.patchState({ sorting },"/searchUser");
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.userService.patchState({ paginator },"/searchUser");
  }
  // form actions



 addOPR(id: string,revId:string, role:string) {
  const modalRef = this.modalService.open(OperationalUserModalComponent, { size: 'xl' });
  modalRef.componentInstance.id = id;
  modalRef.componentInstance.revId = revId;
  modalRef.componentInstance.role =role;
  modalRef.result.then(() =>
    this.userService.fetchIT(id),
    () => { }
  );
}
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
        this.department="0";
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
        this.userService.patchState({ departmentId:this.department },"/searchUser");
      }
    }
  }
  setDivision(value){
    var position =value.split(":")
    if(position.length>1){
      this.division= position[1].toString().trim();
      if(this.division != "0"){
        this.getProjectForDivision()
        this.userService.patchState({ divisionId:this.division },"/searchUser");
      }
    }
  }
  getDivisionForDepartment(){
    this.divisionList=[];
    this.projectService.getDivisionList(this.department).pipe(
      tap((res: any) => {
        this.divisionList = res;
        console.log("divisionList", this.divisionList)

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
      if(this.project != "0"){
        this.userService.patchState({ projectId:this.project },"/searchUser");
      }
    }
  }
  getProjectForDivision(){
    this.projectList=[];
    this.projectService.getProjectList(this.division).pipe(
      tap((res: any) => {
        this.projectList = res;
        console.log("projectList", this.projectList)
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  clearFilter(){

    if(this.isClearFilter){
      this.division="0";

      this.project="0";
      if(this.projectList.length>0){
        this.projectList.splice(0, this.projectList.length);
      }
      if(this.divisionList.length>0){
        this.divisionList.splice(0, this.divisionList.length);
      }
      if(this.departmentList.length>0){
        this.departmentList.splice(0, this.departmentList.length);
      }
      this.getDepartment();
      (<HTMLInputElement>document.getElementById("searchText")).value="";
      this.userService.setDefaults();
      this.userService.patchState({ },"/searchUser");
      this.grouping = this.userService.grouping;
      this.paginator = this.userService.paginator;
      this.sorting = this.userService.sorting;
      this.department="0";
    }else{
      (<HTMLInputElement>document.getElementById("searchText")).value="";
    }
  }


}
