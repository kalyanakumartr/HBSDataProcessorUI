import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  GroupingState,
  PaginatorState,
  SortState,
  ICreateAction,
  IEditAction,
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

@Component({
  selector: 'app-user-list',
  templateUrl: './all-user-obj-list.component.html',
  styleUrls: ['./all-user-obj-list.component.scss']
})
export class AllUserObjListComponent implements
OnInit,
OnDestroy,
ICreateAction,
IEditAction,
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
private subscriptions: Subscription[] = [];
authModel:AuthModel;
  constructor(private fb: FormBuilder,
    private modalService: NgbModal, public userService: UsersService) {

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
  create() {
    this.edit(undefined);
  }

  edit(id: number) {
     const modalRef = this.modalService.open(EditUserModalComponent, { size: 'xl' });
     modalRef.componentInstance.id = id;
     modalRef.result.then(() =>
       this.userService.fetch(""),
       () => { }
     );
  }

  addHR(id: string, name:string) {
    const modalRef = this.modalService.open(UserHRModalComponent, { size: 'xl' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.name =name;
    modalRef.result.then(() =>
      this.userService.fetchHR(id),
      () => { }
    );
 }
 addIT(id: string, name:string) {
  const modalRef = this.modalService.open(UserITModalComponent, { size: 'xl' });
  modalRef.componentInstance.id = id;
  modalRef.componentInstance.name =name;
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
}
