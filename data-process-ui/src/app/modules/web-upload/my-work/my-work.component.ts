import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { GroupingState, IDeleteAction, IDeleteSelectedAction, IFetchSelectedAction, IFilterView, IGroupingView, ISearchView, ISortView, IUpdateStatusForSelectedAction, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { AuthModel } from '../../auth/_models/auth.model';
import { UsersService } from '../../auth/_services/user.service';
import { WorkAllocationService } from '../../auth/_services/workallocation.service';
import { WorkUnitModalComponent } from '../work-unit-modal/work-unit-modal.component';

@Component({
  selector: 'app-my-work',
  templateUrl: './my-work.component.html',
  styleUrls: ['./my-work.component.scss']
})
export class MyWorkComponent implements
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
queueList: any;
statusList:any;
hasLink:boolean;
hasCheckbox:boolean;
selectedQueue:string;
selectedStatus:string;
private subscriptions: Subscription[] = [];
authModel:AuthModel;
  constructor(private fb: FormBuilder,
    private modalService: NgbModal, public workAllocationService: WorkAllocationService) {
      this.queueList=[];
      this.statusList=[];
      this.hasLink=true;
      this.hasCheckbox=false;
  }

  ngOnInit(): void {
    //this.filterForm();
    this.getQueues();
    setTimeout(()=>{
 //this.workAllocationService.patchStateWithoutFetch({ this.sorting});
 this.workAllocationService.patchStateWithoutFetch({ queueList: [this.selectedQueue]});
 this.workAllocationService.patchStateWithoutFetch({ taskStatusList: [this.selectedStatus] });
 this.workAllocationService.fetch("/searchTask");
     }, 1000)
    this.searchForm();

    console.log("UserList :", this.subscriptions)
    this.grouping = this.workAllocationService.grouping;
    this.paginator = this.workAllocationService.paginator;
    this.sorting = this.workAllocationService.sorting;
    const sb = this.workAllocationService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }
  public getTasks() {
    console.log("Inside get Tasks")
    this.workAllocationService.getWorkUnitList(this.selectedQueue,this.selectedStatus).subscribe(users => {
      this.subscriptions = users;
    });
    console.log(this.subscriptions );
  }
  public getQueues() {
    console.log("Inside get Queue")
    this.workAllocationService.getQueueForUser("").subscribe(queues => {
      this.queueList = queues;
      this.selectedQueue=this.queueList[0];
      this.getStatus();
    });
    console.log("QueueList",this.queueList );
  }
  public getStatus() {
    console.log("Inside get Queue")
    this.workAllocationService.getStatusForQueue(this.selectedQueue).subscribe(status => {
      this.statusList = status;
      this.selectedStatus=this.statusList[0];
    });
    console.log("statusList", this.statusList );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  openWworkUnit(task: any) {
    const modalRef = this.modalService.open(WorkUnitModalComponent, { size: 'xl' });
    modalRef.componentInstance.task = task;
  }
  checkAll(obj:any){

  }
  selectQueue(value){
    console.log(value);
    var position =value.split(": ");
    if(position.length>1){
      this.selectedQueue= position[1];
    }
    if(['Group','ProductionTeam'].includes(this.selectedQueue)){
      this.hasCheckbox=true;
      this.hasLink=false;
    }else{
      this.hasCheckbox=false;
      this.hasLink=true;
    }
    if(this.selectedQueue!="" && this.selectedStatus!=""){
      this.workAllocationService.setValues('',this.selectedQueue, this.selectedStatus);
      this.workAllocationService.patchState({},"/searchTask");
    }
  }
  selectTask(value){
    console.log(value);
    var position =value.split(": ");
    if(position.length>1){
      this.selectedStatus= position[1];
    }
    console.log("Queue", this.selectedQueue, "Status", this.selectedStatus);
    if(this.selectedQueue!="" && this.selectedStatus!=""){
      this.workAllocationService.setValues('',this.selectedQueue, this.selectedStatus);
      this.workAllocationService.patchState({},"/searchTask");
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
    this.workAllocationService.patchState({ filter },"/searchTask");
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
    this.workAllocationService.patchState({ searchTerm },"/searchTask");
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
    this.workAllocationService.patchState({ sorting },"/searchTask");
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.workAllocationService.patchState({ paginator },"/searchTask");
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
