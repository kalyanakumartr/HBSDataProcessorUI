import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Process } from '../../time-tracker/modal/process.model';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { GroupingState, ICreateAction, IDeleteAction, IDeleteSelectedAction, IEditAction, IFetchSelectedAction, IFilterView, IGroupingView, ISearchView, ISortView, IUpdateStatusForSelectedAction, PaginatorState, SortProcess, SortState } from 'src/app/_metronic/shared/crud-table';
import { GroupTeamService } from '../../auth/_services/groupteam.services';
import { ProcessService } from '../../auth/_services/process.services';
import { ProjectService } from '../../auth/_services/project.services';
import { GroupCreateComponent } from '../group-create/group-create.component';
import { ProjectCreateComponent } from '../project-create/project-create.component';
import { ProjectProcessCreateComponent } from '../project-process-create/project-process-create.component';
import { ProjectAssignProcessComponent } from '../project-assign-process/project-assign-process.component';

@Component({
  selector: 'app-project-process-list',
  templateUrl: './project-process-list.component.html',
  styleUrls: ['./project-process-list.component.scss']
})
export class ProjectProcessListComponent implements
    OnInit,
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
  sorting: SortProcess;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  departmentList:any[];
  department:any;
  divisionList:any[];
  division:any;
  projectList:any[];
  project:any;
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
    public projectService: ProjectService,
    public processSerive:ProcessService
  ) {
    this.processSerive.listen().subscribe((m: any) => {
      console.log('m -- -- --', m);
      this.filter();
    });
    this.sel = '0';
    this.projectList=[];
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
    this.project = '0: 0';

    this.processSerive.fetch('/searchProcess');
    console.log('UserList :', this.subscriptions);
    this.grouping = this.processSerive.grouping;
    this.paginator = this.processSerive.paginator;
    this.sorting = this.processSerive.sorting;

    const sb = this.processSerive.isLoading$.subscribe(
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
    this.processSerive.patchState({ filter }, '/searchProcess');
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
    this.processSerive.patchState({ searchTerm }, '/searchProcess');
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
    this.processSerive.patchState({ sorting }, '/searchProcess');
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.processSerive.patchState({ paginator }, '/searchProcess');
  }
  // form actions  create(): void {

  edit(id: number): void {
    throw new Error('Method not implemented.');
  }
  create() {
    if(this.division){
     this.addGroup(undefined, this.division);
    }else{
      alert("Please Select Department & Divison");
    }
  }

  /*editGroup(groupId: string, division: string): void {
    this.addGroup(groupId, division);

  }
*/
  addGroup(groupId: string, division: string) {
    if(groupId !="0: 0"){
      const modalRef = this.modalService.open(GroupCreateComponent, {
        size: 'xl',
      });
      modalRef.componentInstance.groupId = groupId;
      modalRef.componentInstance.divisionId = division;

  }else{
    alert("Please Select Department & Division")
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
        this.processSerive.patchState(
          { departmentId: this.department },
          '/searchProcess'
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
        this.processSerive.patchState(
          { divisionId: this.division },
          '/searchProcess'
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
  setProject(value) {
    var position = value.split(':');
    if (position.length > 1) {
      this.project = position[1].toString().trim();
      if (this.project != '0') {
        this.processSerive.patchState({ projectId: this.project }, '/searchProcess');
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





  taskCreate()
  {
    if(this.project != "0: 0"){
    const modalRef = this.modalService.open(ProjectProcessCreateComponent, { size: 'xl' });
    modalRef.componentInstance.projectId = this.project;
  }else{
    alert("Please Select the Project");
  }
  }


  projectAssignTask()
  {
    if(this.project != "0: 0"){
      const modalRef = this.modalService.open(ProjectAssignProcessComponent,{ size: 'xl' });
      modalRef.componentInstance.projectId = this.project;
    }else{
      alert("Please Select the Project");
    }
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
      this.processSerive.setDefaults();
      this.processSerive.patchState({}, '/searchProcess');
      this.grouping = this.processSerive.grouping;
      this.paginator = this.processSerive.paginator;
      this.sorting = this.processSerive.sorting;
      this.department = '0.0';
    } else {
      (<HTMLInputElement>document.getElementById('searchText')).value = '';
    }
  }  exportExcel() {
    this.processSerive.
    exportExcel('/exportToExcelProcessTaskReport', 'Report')
   // exportExcel('/exportToExcelProcessTaskReport', 'Report')
    .subscribe(
      (responseObj) => {
        console.log('Process report success', responseObj);
        var downloadURL = window.URL.createObjectURL(responseObj);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Process.xlsx';
        link.click();
      },
      (error) => {
        console.log('report error', error);
      }
    );
  }
}
