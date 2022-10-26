import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
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
import { SubCountry } from '../../auth/_models/sub-country.model';
import { ProjectService } from '../../auth/_services/project.services';
import { RoadtypeService } from '../../auth/_services/roadtype.services';
import { ProjectAssignRoadtypeComponent } from '../project-assign-roadtype/project-assign-roadtype.component';
import { RoadtypeCreateComponent } from '../roadtype-create/roadtype-create.component';
import { RoadtypePoListComponent } from '../roadtype-po-list/roadtype-po-list.component';

@Component({
  selector: 'app-project-roadtype',
  templateUrl: './project-roadtype.component.html',
  styleUrls: ['./project-roadtype.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class ProjectRoadtypeComponent
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
  departmentList: any[];
  department: any;
  divisionList: any[];
  division: any;
  projectList: any[];
  project: any;
  departmentName: string;
  divisionName: string;
  showDivision: boolean;
  showDepartment: boolean;
  isClearFilter: boolean;
  userService: any;
  sel: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public projectService: ProjectService,
    public roadTypeService: RoadtypeService
  ) {
    this.roadTypeService.listen().subscribe((m: any) => {
      console.log('m -- -- --', m);
      this.filter();
    });
    this.sel = '0';
    this.projectList = [];
    this.divisionList = [];
    this.isClearFilter = false;
    this.showDivision = true;
    this.showDepartment = true;
  }
  filter() {
    const filter = {};
    const status = this.filterGroup.get('status').value;
    if (status) {
      filter['status'] = status;
    }

    const type = this.filterGroup.get('type').value;
    if (type) {
      filter['type'] = type;
    }
    this.roadTypeService.patchState({ filter }, '/searchRoadType');
  }
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

  updateStatusForSelected() {}
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  fetchSelected() {}
  ngOnInit(): void {
    if (this.showDivision) {
      this.getDepartment();
      this.division = '0: 0';
      this.department = '0: 0';
    }
    this.project = '0: 0';
    this.roadTypeService.fetch('/searchRoadType');
    console.log('UserList :', this.subscriptions);
    this.grouping = this.roadTypeService.grouping;
    this.paginator = this.roadTypeService.paginator;
    this.sorting = this.roadTypeService.sorting;

    const sb = this.roadTypeService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    this.getDepartment();
    setTimeout(() => {
      this.department = '0: 0';
    }, 5000);
  }
  ngAfterViewInit() {}
  create() {
    if (this.project != "0: 0") {
      var projectObj;
      this.projectList.forEach((el) => {
        if(this.project == el.projectId){
          projectObj =el;
        }

      });
      if(projectObj){
        this.addRoadType(undefined, projectObj.projectId, projectObj.projectName, this.division, projectObj.clientName,undefined);
      }
     // this.projectroadtype();
    } else {
      alert('Please Select Project');
    }
  }
  edit(id: number): void {
    throw new Error('Method not implemented.');
  }
  search(searchTerm: string) {
    this.roadTypeService.patchState({ searchTerm }, '/searchRoadType');
  }
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
  editRoadType(
    poDetailId: string,
    projectId: string,
    projectName: string,
    roadType: any,
    divisionId: string,
    clientName: string
  ): void {
    this.addRoadType(poDetailId,projectId, projectName,  divisionId ,clientName, roadType);
  }

  projectroadtype() {
    const modalRef = this.modalService.open(ProjectAssignRoadtypeComponent, {
      size: 'xl',
    });
  }
  addRoadType(poDetailId:string, projectId: string, projectName: string, divisionId: string,clientName:string, roadType: any) {
    if (divisionId != '0: 0') {
      const modalRef = this.modalService.open(ProjectAssignRoadtypeComponent, {
        size: 'xl',
      });
      modalRef.componentInstance.poDetailId = poDetailId;
      modalRef.componentInstance.projectId = projectId;
      modalRef.componentInstance.projectName = projectName;
      modalRef.componentInstance.divisionId = divisionId;
      modalRef.componentInstance.clientName = clientName;
      modalRef.componentInstance.roadTypeObj = roadType;
    } else {
      alert('please Select division');
    }
  }
  addPO(poDetailId: string, projectId: string, divisionId: string,projectName:string,clientName:string,roadType:any){
    const modalRef = this.modalService.open(RoadtypePoListComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.poDetailId = poDetailId;
    modalRef.componentInstance.projectId = projectId;
    modalRef.componentInstance.projectName = projectName;
    modalRef.componentInstance.divisionId = divisionId;
    modalRef.componentInstance.clientName = clientName;
    modalRef.componentInstance.roadTypeObj = roadType;

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
        this.roadTypeService.patchState(
          { departmentId: this.department },
          '/searchRoadType'
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
        this.roadTypeService.patchState(
          { divisionId: this.division },
          '/searchRoadType'
        );
      }
    }
  }

  setProject(value) {
    var position = value.split(':');
    if (position.length > 1) {
      this.project = position[1].toString().trim();
      if (this.project != '0') {
        this.roadTypeService.patchState(
          { projectId: this.project },
          '/searchRoadType'
        );
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
          this.project = '0: 0';
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
  getDivisionForDepartment() {
    this.divisionList = [];
    this.projectService
      .getDivisionList(this.department)
      .pipe(
        tap((res: any) => {
          this.divisionList = res;
          console.log('divisionList', this.divisionList);
          this.division = '0: 0';
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
  delete(id: number) {}

  deleteSelected() {}
  clearFilter() {
    if (this.isClearFilter) {
      if (this.showDivision) {
        this.division = '0: 0';
        if (this.divisionList.length > 0) {
          this.divisionList.splice(0, this.divisionList.length);
        }
      }
      if (this.showDepartment) {
        if (this.departmentList.length > 0) {
          this.departmentList.splice(0, this.departmentList.length);
        }
        this.getDepartment();

        this.project = '0: 0';
        if (this.projectList.length > 0) {
          this.projectList.splice(0, this.projectList.length);
        }
      } else {
        this.project = '0: 0';
      }

      (<HTMLInputElement>document.getElementById('searchText')).value = '';

      if (this.showDivision) {
        this.department = '0: 0';
      }
    } else {
      (<HTMLInputElement>document.getElementById('searchText')).value = '';
    }
  }

  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.roadTypeService.patchState({ sorting }, '/searchRoadType');
  }

  paginate(paginator: PaginatorState) {
    this.roadTypeService.patchState({ paginator }, '/searchRoadType');
  }

  exportExcel() {
    (<HTMLInputElement>document.getElementById('exportExcel')).disabled = true;
    (<HTMLInputElement>document.getElementById('divSpinnerId')).hidden = false;
    this.roadTypeService
      .exportExcel('/exportToExcelSubCountryList', 'Project')
      .subscribe(
        (responseObj) => {
          console.log('Project success', responseObj);
          var downloadURL = window.URL.createObjectURL(responseObj);
          var link = document.createElement('a');
          link.href = downloadURL;
          link.download = 'projectSubCountryList.xlsx';
          link.click();
          (<HTMLInputElement>document.getElementById('exportExcel')).disabled =
            false;
          (<HTMLInputElement>document.getElementById('divSpinnerId')).hidden =
            true;
        },
        (error) => {
          console.log('report error', error);
          (<HTMLInputElement>document.getElementById('exportExcel')).disabled =
            false;
          (<HTMLInputElement>document.getElementById('divSpinnerId')).hidden =
            true;
        }
      );
  }
}
