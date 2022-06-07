import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { WorkUnitEditComponent } from '../work-unit-edit/work-unit-edit.component';
import KTLayoutQuickUser from '../../../../assets/js/layout/extended/quick-user';
import { KTUtil } from '../../../../assets/js/components/util';
import { WorkUnitSearchComponent } from '../work-unit-search/work-unit-search.component';

@Component({
  selector: 'app-my-work',
  templateUrl: './my-work.component.html',
  styleUrls: ['./my-work.component.scss'],
  encapsulation: ViewEncapsulation.None
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
  batchList: any;
  assignedToUserGroupList:any;
  queueList: any;
  statusList: any;
  hasLink: boolean;
  hasEdit:boolean;
  hasCheckbox: boolean;
  isAssigned:boolean;
  hasGroup:boolean;
  hasBatch:boolean;
  wuCount:number;
  wuTotalMiles:number;
  hasDeliverToClient:boolean;
  allWorkUnitIds: string[] = [];
  allWUMiles: Map<string, string> ;
  selectedWorkUnitIds: string[] = [];
  selectedQueue: string;
  mappedSkill: string;
  selectedStatus: string;
  selectedUser: string;
  allotmentId:string;
  updateTask:UpdateTaskModel;
  projectList:any[];
  batch:string = "New";
  new:string = "New";
  project:any;
  formGroup: FormGroup;
  groupId:string;
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
    this.allWUMiles = new Map<string, string>();
    this.selectedWorkUnitIds = [];
    this.hasLink = true;
    this.hasEdit=false;
    this.hasCheckbox = false;
    this.isAssigned = false;
    this.groupId='';
    this.workAllocationService.listen().subscribe((m:any)=>{
      console.log("m -- -- --",m);
      this.filter();
    });
    this.formGroup = new FormGroup({
      project: new FormControl(),
      selectedQueue: new FormControl(),
      selectedStatus: new FormControl(),
    });
  }
  ngAfterViewInit(): void {
    KTUtil.ready(() => {

      // Init Quick Offcanvas Panel
      KTLayoutQuickUser.init('kt_advance_search');

  })
}
  ngOnInit(): void {
    //this.filterForm();
    this.user$ = this.authService.currentUserSubject.asObservable();
    this.getQueues();
    this.hasBatch=false;
    this.hasDeliverToClient=false;
    this.user$.pipe(first()).subscribe(value => { this.getProjectForDivision(value.operationalRecord.division.divisionId);this.selectedUser=value.userId;this.setGroup(value.operationalRecord.group.teamId,); });
    this.wuTotalMiles=0.00;
    this.wuCount=0;
    setTimeout(() => {
      //this.workAllocationService.patchStateWithoutFetch({ this.sorting});
      this.workAllocationService.patchStateWithoutFetch({
        projectId: [this.project],
      });
      this.workAllocationService.patchStateWithoutFetch({
        queueList: [this.selectedQueue],
      });
      const statusList: string[] = this.selectedStatus.split(',');
      if(statusList.length>0){

        this.workAllocationService.patchStateWithoutFetch({
          taskStatusList: statusList,
      });
      }
      else{
        this.workAllocationService.patchStateWithoutFetch({
          taskStatusList: [this.selectedStatus],
      });
      }
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
    this.formGroup = this.fb.group({

      project: ['', Validators.compose([ ])],
      selectedQueue: [''],
      selectedStatus: ['', Validators.compose([ ])]
    });
    this.formGroup.patchValue({
      project : "0: 0",
      selectedQueue:"0",
      selectedStatus:"0"
    });
  }
  setGroup(groupId){
    this.groupId =groupId;
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
  advanceSearch(id: number) {
    const modalRef = this.modalService.open(WorkUnitSearchComponent, { size: 'sm' ,windowClass: 'custom-class'});
    modalRef.componentInstance.projectId = this.project;
    modalRef.componentInstance.group = this.groupId;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.getWorkUnitIds();
    });

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
      this.mappedSkill = this.queueList[0].mappedSkill;
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
      .getAssignedtoUser(this.mappedSkill)
      .subscribe((userList) => {
        this.assignedToUserList = userList;
        this.selectedUser = '0: 0';
        console.log("UserList"+userList);
      });
  }
  getBatchList(){
    this.workAllocationService
      .getBatchList(this.selectedQueue,this.project)
      .subscribe((batchList) => {
        this.batchList = batchList;
        console.log("BatchList"+batchList);
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
  openWorkUnit(task: any,selectedQueue:any) {
    const modalRef = this.modalService.open(WorkUnitModalComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.task = task;
    modalRef.componentInstance.queue = selectedQueue;
    modalRef.componentInstance.status = this.selectedStatus;

  }
  editWorkUnit(task: any) {
    const modalRef = this.modalService.open(WorkUnitEditComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.task = task;
  }
  //CheckBox
  checkAll() {
    var i=0;
    var checkAllValue = false;
    if ((<HTMLInputElement>document.getElementById('checkAllBox')).checked) {
      checkAllValue = true;
    }
    this.wuCount=0;
    this.wuTotalMiles=0.00;
    this.allWorkUnitIds.forEach(function (workunit) {
      console.log('WU', workunit);
      (<HTMLInputElement>document.getElementById(workunit)).checked =
        checkAllValue;
        this.wuCount++;
        this.wuTotalMiles = this.wuTotalMiles + parseFloat(this.allWUMiles.get(workunit));
        i++;
    });
  }
  checkBoxWorkUnit(id) {
    var miles =parseFloat(this.allWUMiles.get(id));
    miles = miles == NaN?0.00:miles;
    if ((<HTMLInputElement>document.getElementById(id)).checked == false) {
      (<HTMLInputElement>document.getElementById('checkAllBox')).checked =
        false;
        this.wuCount--;
        this.wuTotalMiles = this.wuTotalMiles - miles;
    }else{
      this.wuCount++;
      this.wuTotalMiles = this.wuTotalMiles + miles;
    }
  }

  selectQueue(value) {
    console.log(value);
    var position = value.split(': ');
    if (position.length > 1) {
      this.selectedQueue = position[1];
    }
    this.queueList
    for (var queue of this.queueList) {
      if (this.selectedQueue == queue.queueId) {
        this.hasEdit=queue.editable;
        this.mappedSkill=queue.mappedSkill
      }
    }
    if (['Group', 'ProductionTeam','QualityControlTeam','HoldQueue','QualityAssuranceTeam','ReadyForDelivery','DeliveryToClient'].includes(this.selectedQueue)) {
      this.hasCheckbox = true;
      this.hasBatch=false;
      this.hasDeliverToClient=false;
      this.hasLink = false;
      if (['Group'].includes(this.selectedQueue)) {
        this.hasGroup=true;
        this.getAllotedUserGroup();
      }else if (['QualityAssuranceTeam'].includes(this.selectedQueue)) {
        this.hasGroup=false;
        this.hasBatch=true;
        this.getBatchList();
        this.getAssignedtoUser();
      }else if (['ReadyForDelivery'].includes(this.selectedQueue)) {
        this.hasGroup=false;
        this.hasBatch=true;
        this.hasDeliverToClient=true;
        this.getBatchList();
      }else if (['DeliveryToClient'].includes(this.selectedQueue)) {
        this.hasGroup=false;
        this.hasBatch=false;
        this.hasDeliverToClient=false;
        this.hasCheckbox = false;
        this.getBatchList();
      }else{

        if (['HoldQueue'].includes(this.selectedQueue) && ['Ready'].includes(this.selectedStatus)) {
          this.hasCheckbox = true;
          this.hasBatch=false;
          this.hasDeliverToClient=false;
          this.hasLink = true;
          this.hasGroup=false;
          this.getAssignedtoUser();
        }else if (['HoldQueue'].includes(this.selectedQueue) && ['Assigned','Completed'].includes(this.selectedStatus)) {
          this.hasCheckbox = false;
          this.hasBatch=false;
          this.hasDeliverToClient=false;
          this.hasLink = true;
        }else if (['HoldQueue'].includes(this.selectedQueue) && ['Hold'].includes(this.selectedStatus)) {
          this.hasCheckbox = false;
          this.hasLink = true;
        }else{
          this.hasGroup=false;
          this.getAssignedtoUser();
        }
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
    let miles : Map<string, string> = new Map<string, string>();
    const that = this;
    this.workAllocationService.items$.forEach(function (items) {
      ids=[];
      var i=0;
      items.forEach(function (item) {

        if(that.isAssigned){
          ids.push(item.nextAllocationId);
        }else{
          ids.push(item.allocationId);
        }
        that.allWUMiles.set(ids[i],item.coreData.roadData.wuMiles);
        console.log(miles, item.allocationId,item.coreData.roadData.wuMiles);
        i++;
      });
      console.log(ids,"before Slice", that.allWorkUnitIds);
      that.allWorkUnitIds.slice(0, that.allWorkUnitIds.length - 1);

    console.log(ids,"After Slice", that.allWorkUnitIds);
    that.allWorkUnitIds = ids;



    console.log(miles,"After Assign New Miles", that.allWUMiles);
    console.log(ids,"After Assign New ids", that.allWorkUnitIds);
    });

  }
  setBatch(value){
    console.log(value);
    var position = value.split(': ');
    if (position.length > 1) {
      this.batch = position[1];
    }
  }

  assignWorkUnits() {
    var updateTask= new UpdateTaskModel;
    var taskBatch= new TaskBatch;
    var name;
    console.log("hasDeliverToClient",this.hasDeliverToClient);
    updateTask.triggeredAction="Default";
    updateTask.statusId ="Assigned";
    if(this.hasGroup){
      for (var user of this.assignedToUserGroupList) {
        if (this.selectedUser == user.allotmentId) {
          console.log("--kk--",user);
          name = user.displayName;
        }
      }
    }else if(this.hasDeliverToClient){
      updateTask.triggeredAction="StartStop";
      updateTask.statusId ="Ready";
      console.log("selectedUser",this.selectedUser);
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

    if(this.hasGroup){
      updateTask.allotmentId= this.selectedUser;
      updateTask.allotedTo='';
      updateTask.teamId='';
    }else if(this.hasDeliverToClient){
      updateTask.allotmentId= '';
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
    if(this.batch == "New"){
      taskBatch.batch="New";
      taskBatch.batchId="";
    }else if(this.batch == "NO_BATCH"){
      taskBatch.batch="None";
      taskBatch.batchId="";
    }else if(this.batch.length>3){
      taskBatch.batch="Append";
      taskBatch.batchId=this.batch;
    }else{
      taskBatch.batch="None";
      taskBatch.batchId="";
    }
    updateTask.taskBatch=  taskBatch;
    updateTask.skillSet=this.mappedSkill != null?this.mappedSkill:"Production";

    updateTask.reasonId ="NOREASON"
    updateTask.remarks="";

    if(this.selectedStatus == "Assigned"){
      taskBatch.batch="None";
      taskBatch.batchId="";
      updateTask.taskBatch=  taskBatch;
      this.workAllocationService.reAllocateTask(updateTask)
      .subscribe((res: any)=>
      {
          this.openSnackBar(res.messageCode,"!!")
          this.search('');
          this.getBatchList();
      });
      console.log("SelectedWork Unit Ids",this.selectedWorkUnitIds);
    // alert(updateTask+'Work Unit will be assigned to Selected User' + name);
    }else{
      this.workAllocationService.updateTask(updateTask)
      .subscribe((res: any)=>
      {
          this.openSnackBar(res.messageCode,"!!")
          this.search('');
          this.getBatchList();
      });
      console.log("SelectedWork Unit Ids",this.selectedWorkUnitIds);
    // alert(updateTask+'Work Unit will be assigned to Selected User' + name);
    }
  }
  openSnackBar(message: string, action: string) {

    const terms = ["failed", "already"];
    const result1 = terms.some(term => message.includes(term));

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
    if (['HoldQueue'].includes(this.selectedQueue) && ['Ready'].includes(this.selectedStatus)) {
      this.hasCheckbox = true;
      this.hasBatch=false;
      this.hasDeliverToClient=false;
      this.hasLink = false;
      this.hasGroup=false;
      this.getAssignedtoUser();
    }else if (['HoldQueue'].includes(this.selectedQueue) && ['Assigned','Completed'].includes(this.selectedStatus)) {
      this.hasCheckbox = false;
      this.hasBatch=false;
      this.hasDeliverToClient=false;
      this.hasLink = true;
    }else if (['HoldQueue'].includes(this.selectedQueue) && ['Hold'].includes(this.selectedStatus)) {
      this.hasCheckbox = false;
      this.hasLink = true;
    }else{

    }
    if (['Assigned'].includes(this.selectedStatus)){
      this.isAssigned=true;
    }else{
      this.isAssigned=false;
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


