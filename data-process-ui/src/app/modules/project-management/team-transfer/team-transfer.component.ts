import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { GroupTeamService } from '../../auth/_services/groupteam.services';
import { ProjectService } from '../../auth/_services/project.services';

@Component({
  selector: 'app-team-transfer',
  templateUrl: './team-transfer.component.html',
  styleUrls: ['./team-transfer.component.scss']
})
export class TeamTransferComponent implements OnInit {
  paginator: PaginatorState;
sorting: SortState;
grouping: GroupingState;
isLoading: boolean;

  group:any;
  searchGroup: FormGroup;
  groupList:any[];
  divisionName:string;
  departmentList:any[];
  showDivision:boolean;
  departmentName:string;
  department:any;
  hasEdit:boolean;
  hasCheckbox: boolean;
  isAssigned:boolean;
divisionList:any[];
isClearFilter:boolean;
division:any;
showDepartment:boolean;
private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public groupTeamService: GroupTeamService,
    public projectService: ProjectService
  ) { this.showDepartment=true;
    this.isClearFilter=false;
    this.showDivision=true;
    this.hasEdit=false;
    this.hasCheckbox = false;
    this.isAssigned = false;

    }

  ngOnInit(): void {
    this.searchForm();
if(this.showDivision){
  this.getDepartment();
  this.division="0: 0";
  this.department="0: 0";
}
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
  //Check All
  checkAll(){

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
  setGroup(value) {
    var position = value.split(':');
    if (position.length > 1) {
      this.group = position[1].toString().trim();
      if (this.group != '0') {
        this.groupTeamService.patchState({ groupId: this.group }, '/searchGroupTeam');
      }
    }
    }
}
