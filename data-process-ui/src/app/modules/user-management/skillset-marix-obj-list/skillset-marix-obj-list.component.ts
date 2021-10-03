import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { of, Subscription } from 'rxjs';
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
import { AuthModel } from '../../auth/_models/auth.model';
import { EditUserModalComponent } from '../users/component/edit-user-modal/edit-user-modal.component';
import { catchError, tap } from 'rxjs/operators';
import { UserSkillSetMatrixService } from '../../auth/_services/user-skillset-matrix.service';
import { SkillSetService } from '../../auth/_services/skillset.service';


@Component({
  selector: 'skillset-matrix-list',
  templateUrl: './skillset-marix-obj-list.component.html',
  styleUrls: ['./skillset-marix-obj-list.component.scss']
})
export class SkillSetMatrixObjListComponent implements
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
skillSetList:any[];
skillsetMatrixList: any;
private subscriptions: Subscription[] = [];
authModel:AuthModel;
  constructor(private fb: FormBuilder,
    private modalService: NgbModal, 
    public userSkillSetMatrixService: UserSkillSetMatrixService,
    public skillSetService: SkillSetService) {
  }

  ngOnInit(): void {
    //this.filterForm();
    this.searchForm();
    this.userSkillSetMatrixService.fetch("/getSkillSetMatrixList");
    console.log("SkillSetMatrix :", this.subscriptions)
    this.grouping = this.userSkillSetMatrixService.grouping;
    this.paginator = this.userSkillSetMatrixService.paginator;
    this.sorting = this.userSkillSetMatrixService.sorting;
    const sb = this.userSkillSetMatrixService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);

    this.skillSetService.getSkillSetList().pipe(
      tap((res: any) => {
        this.skillSetList = res;
        console.log("SkillSet List", this.skillSetList)
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
    
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
    this.userSkillSetMatrixService.patchState({ filter },"/getSkillSetMatrixList");
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
    this.userSkillSetMatrixService.patchState({ searchTerm },"/getSkillSetMatrixList");
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
    this.userSkillSetMatrixService.patchState({ sorting },"/getSkillSetMatrixList");
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.userSkillSetMatrixService.patchState({ paginator },"/getSkillSetMatrixList");
  }
  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number) {
     const modalRef = this.modalService.open(EditUserModalComponent, { size: 'xl' });
     modalRef.componentInstance.id = id;
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
