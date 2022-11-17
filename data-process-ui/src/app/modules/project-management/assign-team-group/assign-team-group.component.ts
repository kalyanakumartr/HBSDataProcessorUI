import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { tap, catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GroupingState, ICreateAction, IDeleteAction, IDeleteSelectedAction,
   IEditAction,
    IFetchSelectedAction, IFilterView, IGroupingView, ISearchView, ISortView, IUpdateStatusForSelectedAction, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { Workflow } from '../../auth/_models/workflow.model';
import { ProjectService } from '../../auth/_services/project.services';
import { WorkflowService } from '../../auth/_services/workflow.services';
import { CreateWorkflowComponent } from '../create-workflow/create-workflow.component';
import { GroupTeamService } from '../../auth/_services/groupteam.services';


@Component({
  selector: 'app-assign-team-group',
  templateUrl: './assign-team-group.component.html',
  styleUrls: ['./assign-team-group.component.scss']
})
export class AssignTeamGroupComponent implements OnInit,
OnDestroy,
ICreateAction,
IEditAction,
IDeleteAction,
IDeleteSelectedAction,
IFetchSelectedAction,
IUpdateStatusForSelectedAction,
//ISortView,
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
  departmentList:any[];
  department:any;
  divisionList:any[];
  division:any;
  groupList:any[];
  group:any;

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
  allotmentId: any[];
  constructor(private fb: FormBuilder,
    private modalService: NgbModal,

    public projectService: ProjectService,
    public workflowService: WorkflowService,
    public groupTeamService: GroupTeamService,
  //public getGroupList :getGroupList
  )  {

      this.workflowService.listen().subscribe((m: any) => {
        console.log('m -- -- --', m);
        this.filter();
      });
      this.sel = '0';
      this.allotmentId=[];
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
    this.project="0: 0";
    this.workflowService.fetch('/searchAllocationGroup');
    console.log('UserList :', this.subscriptions);
    this.grouping = this.workflowService.grouping;
    this.paginator = this.workflowService.paginator;
    this.sorting = this.workflowService.sorting;

    const sb = this.workflowService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    this.getDepartment();
     setTimeout(() => {
      this.department="0: 0";
    }, 5000);

  }
  edit(id: number): void {
    throw new Error('Method not implemented.');
  }
  //edit
  editworkflow(allotmentId: string,groupName:string,divisionId:string):void
  {
this.addworkflow(allotmentId,groupName,divisionId);

  }
  addworkflow(allotmentId,groupName,divisionId)
  {
    if(divisionId !="0: 0"){
      const modalRef = this.modalService.open(CreateWorkflowComponent, {
        size: 'xl',
      });
      modalRef.componentInstance.projectId = allotmentId;
      modalRef.componentInstance.projectName = groupName;
      modalRef.componentInstance.divisionId = divisionId;
  }else{
    alert("please Select division")
  }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  delete(id: number) {
    // const modalRef = this.modalService.open(DeleteCustomerModalComponent);
    // modalRef.componentInstance.id = id;
    // modalRef.result.then(() => this.projectService.fetch(), () => { });
  }

  deleteSelected() {
    // const modalRef = this.modalService.open(DeleteCustomersModalComponent);
    // modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    // modalRef.result.then(() => this.projectService.fetch(), () => { });
  }

  updateStatusForSelected() {
    // const modalRef = this.modalService.open(UpdateCustomersStatusModalComponent);
    // modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    // modalRef.result.then(() => this.projectService.fetch(), () => { });
  }

  fetchSelected() {
    // const modalRef = this.modalService.open(FetchCustomersModalComponent);
    // modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    // modalRef.result.then(() => this.projectService.fetch(), () => { });
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

  search(searchTerm: string) {
    this.workflowService.patchState({ searchTerm }, '/searchAllocationGroup');
  }
  paginate(paginator: PaginatorState) {
    this.workflowService.patchState({ paginator }, '/searchAllocationGroup');
  }
  setDivision(value) {
    var position = value.split(':');
    if (position.length > 1) {
      this.division = position[1].toString().trim();
      if (this.division != '0') {
        this.getGroupForDivision();
        this.workflowService.patchState(
          { divisionId: this.division },
          '/searchAllocationGroup'
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

  getGroupForDivision()
  {
    this.groupList=[];
    this.projectService
      .getGroupList(this.division)
      .pipe(
        tap((res: any) => {
          this.groupList = res;
          console.log('groupList', this.groupList);
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



  /*getProjectForDivision() {
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
  }*/
  filter()
  {
    const filter = {};
  }
  filterForm()
  {
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

  exportExcel(){
    this.workflowService.exportExcel('/exportToExcelAllocationReport', 'Admin').subscribe(
      (responseObj) => {
        console.log('Allocation Report success', responseObj);
        var downloadURL = window.URL.createObjectURL(responseObj);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'Allocation.xlsx';
        link.click();
      },
      (error) => {
        console.log('Allocation report error', error);
      }
    );
  }

  clearFilter(){
    if (this.isClearFilter) {
      this.division = '0';

      this.group = '0';
      if (this.groupList.length > 0) {
        this.groupList.splice(0, this.groupList.length);
      }
      if (this.divisionList.length > 0) {
        this.divisionList.splice(0, this.divisionList.length);
      }
      if (this.departmentList.length > 0) {
        this.departmentList.splice(0, this.departmentList.length);
      }
      this.getDepartment();
      (<HTMLInputElement>document.getElementById('searchText')).value = '';
      this.workflowService.setDefaults();
      this.workflowService.patchState({}, '/searchGroup');
      this.grouping = this.workflowService.grouping;
      this.paginator = this.workflowService.paginator;
      this.sorting = this.workflowService.sorting;
      this.department = '0';
    } else {
      (<HTMLInputElement>document.getElementById('searchText')).value = '';
    }

  }
  setProject(){

  }
  setGroup(value) {
    var position = value.split(':');
    if (position.length > 1) {
      this.group = position[1].toString().trim();
      if (this.group!= '0') {
        this.workflowService.patchState({ groupId: this.group }, '/searchAllocationGroup');
      }
    }
  }
  getDepartment() {
    this.workflowService
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

  create(){
    if(this.division){
      this.addGroup(undefined,undefined,this.division);
    }else{
      alert("Please Select Divison");
    }
  }

    addGroup(projectId: string, projectName:string,divisionId:string) {
      if(divisionId !="0: 0"){
        const modalRef = this.modalService.open(CreateWorkflowComponent, {
          size: 'xl',
        });
        modalRef.componentInstance.projectId = projectId;
        modalRef.componentInstance.projectName = projectName;
        modalRef.componentInstance.divisionId = divisionId;
    }else{
      alert("please Select division")
    }


  }
  setDepartment(value) {
    var position = value.split(':');
    if (position.length > 1) {
      this.department = position[1].toString().trim();
      if (this.department != '0') {
        this.isClearFilter = true;
        this.getDivisionForDepartment();
        this.workflowService.patchState(
          { departmentId: this.department },
          '/searchAllocationGroup'
        );
      }
    }
  }




}
