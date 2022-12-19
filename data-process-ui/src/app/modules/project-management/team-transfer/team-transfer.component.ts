import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import { GroupingState,
  ICreateAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IEditAction, IFetchSelectedAction,
  IFilterView, IGroupingView, ISearchView,
  ISortView, IUpdateStatusForSelectedAction,
   PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { GroupTeamService } from '../../auth/_services/groupteam.services';

import { ProjectService } from '../../auth/_services/project.services';
import { TeamTransferService } from '../../auth/_services/teamtransfer.services';

@Component({
  selector: 'app-team-transfer',
  templateUrl: './team-transfer.component.html',
  styleUrls: ['./team-transfer.component.scss'],
})
export class TeamTransferComponent implements
  OnInit,
    OnDestroy,
   // ICreateAction,
    IEditAction,
    IDeleteAction,
    IDeleteSelectedAction,
    IFetchSelectedAction,
    IUpdateStatusForSelectedAction,
    ISortView,
    IGroupingView,
    ISearchView,
    IFilterView {
      paginator: PaginatorState;
      sorting: SortState;
      grouping: GroupingState;
      isLoading: boolean;
      userCount:number;
      selectedUserIds: string[] = [];
      group: any;
      filterGroup: FormGroup;
      searchGroup: FormGroup;
      groupList: any[];
      teamList: any[];
      team: any;
      divisionName: string;
      transferToList: any[];
      departmentList: any[];
      showDivision: boolean;
      departmentName: string;
      department: any;
      transferTo: string;
      hasEdit: boolean;
      hasCheckbox: boolean;
      isAssigned: boolean;
      divisionList: any[];
      isClearFilter: boolean;
      division: any;
      type: any;
      showDepartment: boolean;
      private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    public teamTransferService: TeamTransferService,
    public projectService: ProjectService,
    public groupTeam: GroupTeamService,

  ) {
    this.teamTransferService.listen().subscribe((m: any) => {
      console.log('m -- -- --', m);
      this.filter();
    });
    this.showDepartment = true;
    this.isClearFilter = false;
    this.showDivision = true;
    this.hasEdit = false;
    this.hasCheckbox = false;
    this.isAssigned = false;
  }

  ngOnInit(): void {
    this.type="TeamMember";
    this.setType();
    this.getTransferUserList();
    this.searchForm();
    if (this.showDivision) {
      this.getDepartment();
      this.division = '0: 0';
      this.department = '0: 0';
    }
    this.teamTransferService.fetch('/searchTransfer');
    console.log('UserList :', this.subscriptions);
    this.grouping = this.teamTransferService.grouping;
    this.paginator = this.teamTransferService.paginator;
    this.sorting = this.teamTransferService.sorting;

    const sb = this.teamTransferService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
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
    this.teamTransferService.patchState({ searchTerm }, '/searchTransfer');
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
    this.teamTransferService.patchState({ sorting }, '/searchTransfer');
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.teamTransferService.patchState({ paginator }, '/searchTransfer');
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
      if (this.teamList.length > 0) {
        this.teamList.splice(0, this.teamList.length);
      }
      if (this.divisionList.length > 0) {
        this.divisionList.splice(0, this.divisionList.length);
      }
      if (this.departmentList.length > 0) {
        this.departmentList.splice(0, this.departmentList.length);
      }
      this.getDepartment();
      (<HTMLInputElement>document.getElementById('searchText')).value = '';
      this.teamTransferService.setDefaults();
      this.teamTransferService.patchState({}, '/searchTransfer');
      this.grouping = this.teamTransferService.grouping;
      this.paginator = this.teamTransferService.paginator;
      this.sorting = this.teamTransferService.sorting;
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

  getTeamForGroup() {
    this.teamList = [];
    this.projectService
      .getTeamList(this.group)
      .pipe(
        tap((res: any) => {
          this.teamList = res;
          console.log('teamList', this.teamList);
          setTimeout(() => {
            this.team = '0: 0';
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
        this.getTransferUserList();
        this.teamTransferService.patchState(
          { divisionId: this.division },
          '/searchTransfer'
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
        this.getTransferUserList();
        this.teamTransferService.patchState(
          { departmentId: this.department },
          '/searchTransfer'
        );
      }
    }
  }
  setGroup(value) {
    var position = value.split(':');
    if (position.length > 1) {
      this.group = position[1].toString().trim();
      if (this.group != '0') {
        this.isClearFilter = true;
        this.getTeamForGroup()
        this.teamTransferService.patchState(
          { groupId: this.group },
          '/searchTransfer'
        );
      }
    }
  }
  setTeam(value) {
    var position = value.split(':');
    if (position.length > 1) {
      this.team = position[1].toString().trim();
      if (this.team != '0') {
        this.teamTransferService.patchState(
          { teamId: this.team },
          '/searchTransfer'
        );
      }
    }
  }
  setTransferTo(value){
    var position = value.split(':');
    if (position.length > 1) {
      this.transferTo = position[1].toString().trim();

    }
  }
  setType() {

        this.teamTransferService.patchState({ type: this.type }, '/searchTransfer' );
        this.getTransferUserList();

  }
  checkBoxWorkUnit(id) {


    if ((<HTMLInputElement>document.getElementById(id)).checked == false) {
      //(<HTMLInputElement>document.getElementById('checkAllBox')).checked =  false;

      this.selectedUserIds.forEach((element,index)=>{
        if(element==id) this.selectedUserIds.splice(index,1);
     });
    }else{
      this.selectedUserIds.push(id);
    }
    console.log("Ids",this.selectedUserIds);
  }
  checkAll() {
    var i=0;
    var checkAllValue = false;
    if ((<HTMLInputElement>document.getElementById('checkAllBox')).checked) {
      checkAllValue = true;
    }
    this.userCount=0;

    console.log("WU Ids",this.selectedUserIds);
    /*const that = this;
    this.allWorkUnitIds.forEach(function (workunit) {
      console.log('WU', workunit);
      (<HTMLInputElement>document.getElementById(workunit)).checked =
        checkAllValue;
        if(checkAllValue){
          that.userCount++;
          that.wuTotalMiles = that.wuTotalMiles + parseFloat(that.allWUMiles.get(workunit));
        }
        i++;
    });*/
  }
  transferUserList(){
    var transferReportees =false;
    if ((<HTMLInputElement>document.getElementById('transferReportees')).checked) {
      transferReportees=true;
    }
    var transfer = this.transferTo.split('/').join('_');
    this.teamTransferService.transferUserList(this.selectedUserIds, transferReportees,this.type, transfer).pipe(
      tap((res: any) => {
        this.transferToList = res;
        console.log('transferToList', this.transferToList);
        this.transferTo = '0: 0';
        this.teamTransferService.listen().subscribe((m: any) => {
          console.log('m -- -- --', m);
          this.filter();
        });
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: [],
        });
      })
    )
    .subscribe(res =>this.openSnackBar(res.messageCode?"Team Transfer Successful":res,"!!"));
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }
  getTransferUserList() {
    var shortNameList=[];
    var userListType='';
    if(this.type == "TeamMember"){
      shortNameList=["TL-Sr","TL-Tr","TL"];
      userListType="Team";
    }else if(this.type == "Team"){
      shortNameList=["PL"];
      userListType="Group";
    }else if(this.type == "Group"){
      shortNameList=["Admin","PM","PM-As"];
    }
    this.teamTransferService.getTransferUserList(shortNameList,this.department,this.division, userListType).pipe(
        tap((res: any) => {
          this.transferToList = res;
          console.log('transferToList', this.transferToList);
          this.transferTo = '0: 0';
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
  delete(id: number) {
    throw new Error('Method not implemented.');
  }

  deleteSelected() {
    throw new Error('Method not implemented.');
  }

  updateStatusForSelected() {
    throw new Error('Method not implemented.');
  }

  fetchSelected() {

    throw new Error('Method not implemented.');
  }
  edit(id: number): void {
    throw new Error('Method not implemented.');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }


  // filtration
  filterForm() {}
  filter() {
    const filter = {};
    this.teamTransferService.patchState({ filter }, '/searchTransfer');
  }

}
