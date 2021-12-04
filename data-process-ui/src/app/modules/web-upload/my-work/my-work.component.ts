import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, first, tap } from 'rxjs/operators';
import {
  GroupingState,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IFilterView,
  IGroupingView,
  ISearchView,
  ISortView,
  IUpdateStatusForSelectedAction,
  PaginatorState,
  SortState,
} from 'src/app/_metronic/shared/crud-table';
import { AuthModel } from '../../auth/_models/auth.model';
import { UsersService } from '../../auth/_services/user.service';
import { WorkAllocationService } from '../../auth/_services/workallocation.service';
import { WorkUnitModel } from '../modal/work-unit.model';
import { UpdateTaskModel } from '../modal/update-task.model';
import { WorkUnitModalComponent } from '../work-unit-modal/work-unit-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../auth/_services/project.services';
import { AuthService, UserModel } from '../../auth';
import { TaskBatch } from '../modal/taskbatch.model';

@Component({
  selector: 'app-my-work',
  templateUrl: './my-work.component.html',
  styleUrls: ['./my-work.component.scss'],
})
export class MyWorkComponent
  implements
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
    IFilterView
{
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  assignedToUserList: any;
  assignedToUserGroupList:any;
  queueList: any;
  statusList: any;
  hasLink: boolean;
  hasCheckbox: boolean;
  hasGroup:boolean;
  allWorkUnitIds: string[] = [];
  selectedWorkUnitIds: string[] = [];
  selectedQueue: string;
  selectedStatus: string;
  selectedUser: string;
  allotmentId:string;
  updateTask:UpdateTaskModel;
  projectList:any[];
  project:any;

  private subscriptions: Subscription[] = [];
  authModel: AuthModel;
  user$: Observable<UserModel>;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    public projectService: ProjectService,
    private authService: AuthService,
    public workAllocationService: WorkAllocationService
  ) {
    this.queueList = [];
    this.statusList = [];
    this.projectList=[];
    this.allWorkUnitIds = [];
    this.selectedWorkUnitIds = [];
    this.hasLink = true;
    this.hasCheckbox = false;
  }

  ngOnInit(): void {
    //this.filterForm();
    this.user$ = this.authService.currentUserSubject.asObservable();
    this.getQueues();
    this.user$.pipe(first()).subscribe(value => { this.getProjectForDivision(value.operationalRecord.division.divisionId) });

    setTimeout(() => {
      //this.workAllocationService.patchStateWithoutFetch({ this.sorting});
      this.workAllocationService.patchStateWithoutFetch({
        projectId: [this.project],
      });
      this.workAllocationService.patchStateWithoutFetch({
        queueList: [this.selectedQueue],
      });
      this.workAllocationService.patchStateWithoutFetch({
        taskStatusList: [this.selectedStatus],
      });
      this.workAllocationService.fetch('/searchTask');
    }, 1000);
    this.searchForm();

    console.log('WorkUnits :', this.subscriptions);
    this.grouping = this.workAllocationService.grouping;
    this.paginator = this.workAllocationService.paginator;
    this.sorting = this.workAllocationService.sorting;
    const sb = this.workAllocationService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
  }
  getProjectForDivision(division){
    this.projectList=[];
    this.projectService.getProjectList(division).pipe(
      tap((res: any) => {
        this.projectList = res;
        if(this.projectList.length>0){
          this.project = this.projectList[0].projectId;
        }

        // console.log("projectList", this.projectList)
        // setTimeout(() => {
        //         this.project="0: 0";
        //       }, 2000);
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
        this.workAllocationService.patchState({ projectId:this.project },"/searchTask");
      }
    }
  }
  public getTasks() {
    console.log('Inside get Tasks');
    this.workAllocationService
      .getWorkUnitList(this.selectedQueue, this.selectedStatus)
      .subscribe((users) => {
        this.subscriptions = users;
      });
    console.log(this.subscriptions);
  }
  public getQueues() {
    console.log('Inside get Queue');
    this.workAllocationService.getQueueForUser('').subscribe((queues) => {
      this.queueList = queues;
      this.selectedQueue = this.queueList[0].queueId;
      this.getStatus();
    });
    console.log('QueueList', this.queueList);
  }
  public getStatus() {
    console.log('Inside get Queue');
    this.workAllocationService
      .getStatusForQueue(this.selectedQueue)
      .subscribe((status) => {
        this.statusList = status;
        this.selectedStatus = this.statusList[0].statusId;
      });
    console.log('statusList', this.statusList);
  }
  getAssignedtoUser() {
    this.workAllocationService
      .getAssignedtoUser(this.selectedQueue)
      .subscribe((userList) => {
        this.assignedToUserList = userList;
        this.selectedUser = this.assignedToUserList[0].employeeId;
        console.log("UserList"+userList);
      });
  }
  getAllotedUserGroup() {
    this.workAllocationService
      .getAllotedUserGroup()
      .subscribe((userGroupList) => {
        this.assignedToUserGroupList = userGroupList;
        this.allotmentId = this.assignedToUserGroupList[0].allotmentId;
        console.log("UserGroupList"+userGroupList);
      });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  openWworkUnit(task: any,selectedQueue:any, selectedStatus:any) {
    const modalRef = this.modalService.open(WorkUnitModalComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.task = task;
    modalRef.componentInstance.queue = selectedQueue;
    modalRef.componentInstance.status = selectedStatus;
  }
  //CheckBox
  checkAll() {
    var checkAllValue = false;
    if ((<HTMLInputElement>document.getElementById('checkAllBox')).checked) {
      checkAllValue = true;
    }
    this.allWorkUnitIds.forEach(function (workunit) {
      console.log('WU', workunit);
      (<HTMLInputElement>document.getElementById(workunit)).checked =
        checkAllValue;
    });
  }
  checkBoxWorkUnit(id) {
    if ((<HTMLInputElement>document.getElementById(id)).checked == false) {
      (<HTMLInputElement>document.getElementById('checkAllBox')).checked =
        false;
    }
  }

  selectQueue(value) {
    console.log(value);
    var position = value.split(': ');
    if (position.length > 1) {
      this.selectedQueue = position[1];
    }

    if (['Group', 'ProductionTeam'].includes(this.selectedQueue)) {
      this.hasCheckbox = true;
      this.hasLink = false;
      if (['Group'].includes(this.selectedQueue)) {
        this.hasGroup=true;
        this.getAllotedUserGroup();
      }else{
        this.hasGroup=false;
        this.getAssignedtoUser();
      }
    } else {
      this.hasCheckbox = false;
      this.hasLink = true;
    }
    if (this.selectedQueue != '' && this.selectedStatus != '') {
      this.workAllocationService.setValues(
        '',
        this.selectedQueue,
        this.selectedStatus
      );
      this.workAllocationService.patchState({}, '/searchTask');
      this.getWorkUnitIds();
    }
    this.getStatus();
    console.log('WorkUnits IDS', this.allWorkUnitIds);
  }

  getWorkUnitIds() {
    var ids = [];
    this.workAllocationService.items$.forEach(function (items) {
      ids=[];
      items.forEach(function (item) {
        ids.push(item.allocationId);
      });
    });
    console.log(ids,"before Slice", this.allWorkUnitIds);
    this.allWorkUnitIds.slice(0, this.allWorkUnitIds.length - 1);
    console.log(ids,"After Slice", this.allWorkUnitIds);
    this.allWorkUnitIds = ids;
    console.log(ids,"After Assign New ids", this.allWorkUnitIds);
  }

  assignWorkUnits() {
    var updateTask= new UpdateTaskModel;
    var taskBatch= new TaskBatch;
    var name;
    if(this.hasGroup){
      for (var user of this.assignedToUserGroupList) {
        if (this.selectedUser == user.allotmentId) {
          console.log("--kk--",user);
          name = user.displayName;
        }
      }
    }else{
      for (var user of this.assignedToUserList) {
        if (this.selectedUser == user.employeeId) {
          console.log("--kk--",user);
          name = user.fullName;
          updateTask.teamId = user.teamId;
        }
      }
    }

    var selectedIds = [];
    console.log(this.allWorkUnitIds,"Ids");
    this.allWorkUnitIds.forEach(function (workunit) {
      var wu =(<HTMLInputElement>document.getElementById(workunit));
      if (wu !=null && wu.checked) {
        if(selectedIds.indexOf(workunit) === -1) {
          selectedIds.push(workunit);
        }
      }
    });
    this.selectedWorkUnitIds.slice(0, this.selectedWorkUnitIds.length - 1);
    this.selectedWorkUnitIds = selectedIds;
    updateTask.allocationIds =this.selectedWorkUnitIds;
    updateTask.queueId =this.selectedQueue;
    updateTask.statusId ="Assigned";
    if(this.hasGroup){
      updateTask.allotmentId= this.selectedUser;
      updateTask.allotedTo='';
      updateTask.teamId='';
    }else{
      updateTask.allotedTo = this.selectedUser;
    }
    //updateTask.teamName
    //updateTask.teamId
    //updateTask.statusReason
    //updateTask.allotmentId
    //updateTask.allotedUserName
    //updateTask.projectId
    taskBatch.batch="None";
    taskBatch.batchId="";
    updateTask.taskBatch=  taskBatch;
    updateTask.skillSet="Production";
    updateTask.triggeredAction="Default";
    updateTask.reasonId ="NOREASON"
    updateTask.remarks="To Team Member End";

    this.workAllocationService.updateTask(updateTask)
    .subscribe((res: any)=>
    {
        this.openSnackBar(res.messageCode,"!!")
        this.search('');
    });
    console.log("SelectedWork Unit Ids",this.selectedWorkUnitIds);
   // alert(updateTask+'Work Unit will be assigned to Selected User' + name);
  }
  openSnackBar(message: string, action: string) {

    const terms = ["failed", "already"];
    const result1 = terms.some(term => message.includes(term));
    alert(result1);
    var redColor = false;
    if( result1){
      redColor =true;
    }
    this.snackBar.open(message, action, {
      duration: 6000,
      panelClass: [redColor?'red-snackbar':'blue-snackbar'],
      verticalPosition:"top"
    });
  }
  selectUser(value) {
    console.log(value);
    var position = value.split(': ');
    if (position.length > 1) {
      this.selectedUser = position[1];
    }
  }
  selectTask(value) {
    console.log(value);
    var position = value.split(': ');
    if (position.length > 1) {
      this.selectedStatus = position[1];
    }
    console.log('Queue', this.selectedQueue, 'Status', this.selectedStatus);
    if (this.selectedQueue != '' && this.selectedStatus != '') {
      this.workAllocationService.setValues(
        '',
        this.selectedQueue,
        this.selectedStatus
      );
      this.workAllocationService.patchState({}, '/searchTask');
    }
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
    this.workAllocationService.patchState({ filter }, '/searchTask');
    this.getWorkUnitIds();
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
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
    this.workAllocationService.patchState({ searchTerm }, '/searchTask');
    this.getWorkUnitIds();
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
    this.workAllocationService.patchState({ sorting }, '/searchTask');
    this.getWorkUnitIds();
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.workAllocationService.patchState({ paginator }, '/searchTask');
    this.getWorkUnitIds();
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
}
