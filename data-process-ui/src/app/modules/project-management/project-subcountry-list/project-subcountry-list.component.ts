import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupingState,
   ICreateAction,
   IDeleteAction,
   IDeleteSelectedAction,
   IEditAction, IFetchSelectedAction,
   IFilterView, IGroupingView, ISearchView,
   ISortView, IUpdateStatusForSelectedAction,
    PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { ProjectService } from '../../auth/_services/project.services';
import { AddSubcountryComponent } from '../add-subcountry/add-subcountry.component';
import { SubcountryService } from '../../auth/_services/subcountry.services';
import { ProjectAssignSubcountryComponent } from '../project-assign-subcountry/project-assign-subcountry.component';


@Component({
  selector: 'app-project-subcountry-list',
  templateUrl: './project-subcountry-list.component.html',
  styleUrls: ['./project-subcountry-list.component.scss']
})
export class ProjectSubcountryListComponent  implements
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
  //  public groupTeamService: GroupTeamService,
    public projectService: ProjectService,
    //public processSerive:ProcessService
    public subcountryService:SubcountryService
  ) {
    this.subcountryService.listen().subscribe((m: any) => {
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

    this.subcountryService.fetch('/searchSubCountry');
    console.log('UserList :', this.subscriptions);
    this.grouping = this.subcountryService.grouping;
    this.paginator = this.subcountryService.paginator;
    this.sorting = this.subcountryService.sorting;

    const sb = this.subcountryService.isLoading$.subscribe(
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
    this.subcountryService.patchState({ filter }, '/searchSubCountry');
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
    this.subcountryService.patchState({ searchTerm }, '/searchSubCountry');
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
    this.subcountryService.patchState({ sorting }, '/searchSubCountry');
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.subcountryService.patchState({ paginator }, '/searchSubCountry');
  }
  // form actions  create(): void {

  edit(id: number): void {
    throw new Error('Method not implemented.');
  }
/*  create() {
    if(this.division){
     this.addGroup(undefined, this.division);
    }else{
      alert("Please Select Department & Divison");
    }
  }*/

  /*editGroup(groupId: string, division: string): void {
    this.addGroup(groupId, division);

  }
*/
  /*addGroup(groupId: string, division: string) {
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
*/
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
        this.subcountryService.patchState(
          { departmentId: this.department },
          '/searchSubCountry'
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
        this.subcountryService.patchState(
          { divisionId: this.division },
          '/searchSubCountry'
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
        this.subcountryService.patchState({ projectId: this.project }, '/searchSubCountry');
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



  subCountry()
  {
    const modalRef = this.modalService.open(AddSubcountryComponent, { size: 'xl' });
  }

  projectAssignSubcountry()
  {
    const modalRef = this.modalService.open(ProjectAssignSubcountryComponent, { size: 'xl' });
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
      this.subcountryService.setDefaults();
      this.subcountryService.patchState({}, '/searchSubCountry');
      this.grouping = this.subcountryService.grouping;
      this.paginator = this.subcountryService.paginator;
      this.sorting = this.subcountryService.sorting;
      this.department = '0';
    } else {
      (<HTMLInputElement>document.getElementById('searchText')).value = '';
    }
  }  exportExcel() {
    this.subcountryService.exportExcel('/exportToExcelGroupTeamReport', 'Report').subscribe(
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
