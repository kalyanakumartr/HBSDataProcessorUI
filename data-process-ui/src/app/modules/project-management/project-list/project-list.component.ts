import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import {
  GroupingState,
  ICreateAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IEditAction,
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
import { ProjectService } from '../../auth/_services/project.services';
import { UsersService } from '../../auth/_services/user.service';
import { UserHRModalComponent } from '../../user-management/users/component/user-hr-modal/user-hr-modal.component';
import { ProjectCreateComponent } from '../project-create/project-create.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent
  implements
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
    IFilterView
{
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  userList: any;
  sel: string;
  departmentList: any[];
  department: any;
  divisionList: any[];
  division: any;
  projectList: any[];
  project: any;
  isClearFilter: boolean;

  private subscriptions: Subscription[] = [];
  authModel: AuthModel;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public userService: UsersService,
    public projectService: ProjectService
  ) {
    this.projectService.listen().subscribe((m: any) => {
      console.log('m -- -- --', m);
      this.filter();
    });
    this.projectList = [];
    this.divisionList = [];
    this.sel = '0';
    this.isClearFilter = false;
  }
  create(): void {
    throw new Error('Method not implemented.');
  }
  edit(id: number): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    //this.filterForm();
    this.searchForm();

    this.projectService.fetch('/searchUser');
    console.log('UserList :', this.subscriptions);
    this.grouping = this.projectService.grouping;
    this.paginator = this.projectService.paginator;
    this.sorting = this.projectService.sorting;

    const sb = this.projectService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    this.getDepartment();
    /* setTimeout(() => {
      this.division="0";
      this.department="0: 0";
      this.project="0";
    }, 5000);*/
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
    this.projectService.patchState({ filter }, '/searchUser');
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
    this.projectService.patchState({ searchTerm }, '/searchUser');
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
    this.projectService.patchState({ sorting }, '/searchUser');
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.projectService.patchState({ paginator }, '/searchUser');
  }
  // form actions

  addProject() {
    const modalRef = this.modalService.open(ProjectCreateComponent, {
      size: 'xl',
    });
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
        this.userService.patchState(
          { departmentId: this.department },
          '/searchUser'
        );
      }
    }
  }
  setDivision(value) {
    var position = value.split(':');
    if (position.length > 1) {
      this.division = position[1].toString().trim();
      if (this.division != '0') {
        this.getProjectForDivision();
        this.userService.patchState(
          { divisionId: this.division },
          '/searchUser'
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
          setTimeout(() => {
            this.division = '0: 0';
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
  setProject(value) {
    var position = value.split(':');
    if (position.length > 1) {
      this.project = position[1].toString().trim();
      if (this.project != '0') {
        this.userService.patchState({ projectId: this.project }, '/searchUser');
      }
    }
  }
  getProjectForDivision() {
    this.projectList = [];
    this.projectService
      .getProjectList(this.division)
      .pipe(
        tap((res: any) => {
          this.projectList = res;
          console.log('projectList', this.projectList);
          setTimeout(() => {
            this.project = '0: 0';
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

      this.project = '0';
      if (this.projectList.length > 0) {
        this.projectList.splice(0, this.projectList.length);
      }
      if (this.divisionList.length > 0) {
        this.divisionList.splice(0, this.divisionList.length);
      }
      if (this.departmentList.length > 0) {
        this.departmentList.splice(0, this.departmentList.length);
      }
      this.getDepartment();
      (<HTMLInputElement>document.getElementById('searchText')).value = '';
      this.projectService.setDefaults();
      this.projectService.patchState({}, '/searchUser');
      this.grouping = this.projectService.grouping;
      this.paginator = this.projectService.paginator;
      this.sorting = this.projectService.sorting;
      this.department = '0';
    } else {
      (<HTMLInputElement>document.getElementById('searchText')).value = '';
    }
  }
  exportExcel() {
    this.projectService.exportExcel('/exportToExcelHRRecord', 'Admin').subscribe(
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
}
