import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { GroupingState, ICreateAction, IDeleteAction, IDeleteSelectedAction, IEditAction, IFetchSelectedAction, IFilterView, IGroupingView, ISearchView, ISortView, IUpdateStatusForSelectedAction, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { GroupTeamService } from '../../auth/_services/groupteam.services';
import { ProjectService } from '../../auth/_services/project.services';
import { GroupCreateComponent } from '../group-create/group-create.component';
import { ProjectCreateComponent } from '../project-create/project-create.component';
import { TeamCreateComponent } from '../team-create/team-create.component';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements     OnInit,
OnDestroy,
ICreateAction,
IEditAction,
IDeleteAction,
IDeleteSelectedAction,
IFetchSelectedAction,
IUpdateStatusForSelectedAction,
ISortView,

IGroupingView,
ISearchView,
IFilterView
{
paginator: PaginatorState;
sorting: SortState;
grouping: GroupingState;
isLoading: boolean;
filterGroup: FormGroup;
searchGroup: FormGroup;
departmentList:any[];
department:any;
divisionList:any[];
division:any;
groupList:any[];
group:any;
departmentName:string;
divisionName:string;
showDivision:boolean;
showDepartment:boolean;
isClearFilter:boolean;

userList: any;
sel: string;
private subscriptions: Subscription[] = [];
constructor(
private fb: FormBuilder,
private modalService: NgbModal,
public groupTeamService: GroupTeamService,
public projectService: ProjectService
) {
this.groupTeamService.listen().subscribe((m: any) => {
  console.log('m -- -- --', m);
  this.filter();
});
this.sel = '0';
this.groupList=[];
this.divisionList=[];
this.isClearFilter=false;
this.showDivision=true;
this.showDepartment=true;
}


ngOnInit(): void {
//this.filterForm();
this.searchForm();
if(this.showDivision){
  this.getDepartment();
  this.division="0: 0";
  this.department="0: 0";
}
this.groupTeamService.patchStateWithoutFetch({ type: 'Team' });
this.groupTeamService.fetch('/searchGroupTeam');
console.log('UserList :', this.subscriptions);
this.grouping = this.groupTeamService.grouping;
this.paginator = this.groupTeamService.paginator;
this.sorting = this.groupTeamService.sorting;

const sb = this.groupTeamService.isLoading$.subscribe(
  (res) => (this.isLoading = res)
);
this.subscriptions.push(sb);
this.getDepartment();
 setTimeout(() => {
  this.department="0: 0";
}, 5000);
}
ngAfterViewInit() {}

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
this.groupTeamService.patchState({ filter }, '/searchGroupTeam');
}

// search
searchForm() {
this.searchGroup = this.fb.group({
  searchTerm: [''],
  department: ['0'],
  division: ['0'],
  project: ['0'],
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
this.groupTeamService.patchState({ searchTerm }, '/searchGroupTeam');
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
this.groupTeamService.patchState({ sorting }, '/searchGroupTeam');
}

// pagination
paginate(paginator: PaginatorState) {
this.groupTeamService.patchState({ paginator }, '/searchGroupTeam');
}
// form actions  create(): void {

edit(id: number): void {
throw new Error('Method not implemented.');
}
create() {
if(this.division){
  this.addTeam(undefined);
}else{
  alert("Please Select Divison");
}
}

editTeam(teamId: string): void {
this.addTeam(teamId);

}

addTeam(teamId: string) {
if(this.division !="0: 0"){
  const modalRef = this.modalService.open(TeamCreateComponent, {
    size: 'xl',
  });
  modalRef.componentInstance.teamId = teamId;
}else{
  alert("please Select division")
}
}

delete(id: number) {
// const modalRef = this.modalService.open(DeleteCustomerModalComponent);
// modalRef.componentInstance.id = id;
// modalRef.result.then(() => this.groupTeamService.fetch(), () => { });
}

deleteSelected() {
// const modalRef = this.modalService.open(DeleteCustomersModalComponent);
// modalRef.componentInstance.ids = this.grouping.getSelectedRows();
// modalRef.result.then(() => this.groupTeamService.fetch(), () => { });
}

updateStatusForSelected() {
// const modalRef = this.modalService.open(UpdateCustomersStatusModalComponent);
// modalRef.componentInstance.ids = this.grouping.getSelectedRows();
// modalRef.result.then(() => this.groupTeamService.fetch(), () => { });
}

fetchSelected() {
// const modalRef = this.modalService.open(FetchCustomersModalComponent);
// modalRef.componentInstance.ids = this.grouping.getSelectedRows();
// modalRef.result.then(() => this.groupTeamService.fetch(), () => { });
}
getDepartment() {
this.projectService
  .getDepartmentList()
  .pipe(
    tap((res: any) => {
      this.departmentList = res;
      console.log('departmentList', this.departmentList);
      this.department = '0: 0';
    }),
    catchError((err) => {
      console.log(err);
      return of({
        items: [],
      });
    })
  )
  .subscribe();
}
setDepartment(value) {
var position = value.split(':');
if (position.length > 1) {
  this.department = position[1].toString().trim();
  if (this.department != '0') {
    this.isClearFilter = true;
    this.getDivisionForDepartment();
    this.groupTeamService.patchState(
      { departmentId: this.department },
      '/searchGroupTeam'
    );
  }
}
}
setDivision(value) {
var position = value.split(':');
if (position.length > 1) {
  this.division = position[1].toString().trim();
  if (this.division != '0') {
    this.getGroupForDivision();
    this.groupTeamService.patchState(
      { divisionId: this.division },
      '/searchGroupTeam'
    );
  }
}
}
getDivisionForDepartment() {
this.divisionList = [];
this.projectService
  .getDivisionList(this.department)
  .pipe(
    tap((res: any) => {
      this.divisionList = res;
      console.log('divisionList', this.divisionList);

    }),
    catchError((err) => {
      console.log(err);
      return of({
        items: [],
      });
    })
  )
  .subscribe();
}
setGroup(value) {
var position = value.split(':');
if (position.length > 1) {
  this.group = position[1].toString().trim();
  if (this.group != '0') {
    this.groupTeamService.patchState({ groupId: this.group }, '/searchGroupTeam');
  }
}
}
getGroupForDivision() {
this.groupList = [];
this.projectService
  .getGroupList(this.division)
  .pipe(
    tap((res: any) => {
      this.groupList = res;
      console.log('groupList', this.groupList);
      setTimeout(() => {
        this.group = '0: 0';
      }, 2000);
    }),
    catchError((err) => {
      console.log(err);
      return of({
        items: [],
      });
    })
  )
  .subscribe();
}
clearFilter() {
if (this.isClearFilter) {
  this.division = '0';

  this.group = '0';
  if (this.groupList.length > 0) {
    this.groupList.splice(0, this.groupList.length);
  }
  if (this.divisionList.length > 0) {
    this.divisionList.splice(0, this.divisionList.length);
  }
  if (this.departmentList.length > 0) {
    this.departmentList.splice(0, this.departmentList.length);
  }
  this.getDepartment();
  (<HTMLInputElement>document.getElementById('searchText')).value = '';
  this.groupTeamService.setDefaults();
  this.groupTeamService.patchState({}, '/searchGroupTeam');
  this.grouping = this.groupTeamService.grouping;
  this.paginator = this.groupTeamService.paginator;
  this.sorting = this.groupTeamService.sorting;
  this.department = '0';
} else {
  (<HTMLInputElement>document.getElementById('searchText')).value = '';
}
}
exportExcel() {
this.groupTeamService.exportExcel('/exportToExcelHRRecord', 'Admin').subscribe(
  (responseObj) => {
    console.log('report success', responseObj);
    var downloadURL = window.URL.createObjectURL(responseObj);
    var link = document.createElement('a');
    link.href = downloadURL;
    link.download = 'HRRecords.xlsx';
    link.click();
  },
  (error) => {
    console.log('report error', error);
  }
);
}
addgroup(){

}
}
