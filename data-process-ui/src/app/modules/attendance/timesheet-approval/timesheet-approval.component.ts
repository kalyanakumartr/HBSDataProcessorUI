import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { GroupingState, IDeleteAction, IDeleteSelectedAction, IFetchSelectedAction, IFilterView, IGroupingView, ISearchView, ISortView, IUpdateStatusForSelectedAction, PaginatorState, SortState, SortStateAttendance } from 'src/app/_metronic/shared/crud-table';
import { AttendanceService } from '../../auth/_services/attendance.service';
import { TimeSheetService } from '../../auth/_services/timesheet.service';
import { TimeSheetApprovalService } from '../../auth/_services/timesheetapproval.service';
import { TimeTrackerApprovalComponent } from '../../time-tracker/time-tracker-approval/time-tracker-approval.component';
import { TimeTrackerComponent } from '../../time-tracker/time-tracker/time-tracker.component';
import { AttendanceModel } from '../modal/attendance.model';
import { LabelValueModel } from '../modal/value-lable.model';

@Component({
  selector: 'app-timesheet-approval',
  templateUrl: './timesheet-approval.component.html',
  styleUrls: ['./timesheet-approval.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class TimesheetApprovalComponent implements OnInit,
ISortView,
IFilterView,
IGroupingView,
ISearchView,
IFilterView {
  paginator: PaginatorState;
  sorting: SortStateAttendance;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  fromDate:string;
  toDate:string;
  headerListdays:string[];
  attendanceList:AttendanceModel[];
  employeeMonthList:LabelValueModel[];
  monthWeeklyList:LabelValueModel[];
  statusList:LabelValueModel[];
  approverMonthList:LabelValueModel[];
  adminSymbolList:LabelValueModel[];
  employeeSymbolList:LabelValueModel[];
  private subscriptions: Subscription[] = [];
  isClearFilter:boolean;
  selectedUser:string;
  userList:any;
  constructor(
    private fb: FormBuilder,
    public modalService: NgbModal,
    private snackBar: MatSnackBar,
    private _router: Router,
    public attendanceService: AttendanceService,
    public timeSheetService: TimeSheetApprovalService) {
      this.timeSheetService.listen().subscribe((m:any)=>{
        console.log("m -- -- --",m);
        this.filter();
      });
    }

  ngOnInit(): void {

    // this.fromDate="01/01/2022";
    // this.toDate="31/01/2022";
    this.searchForm();
    this.getData();
    this.getDateRange();
    this.isClearFilter=false;

    const sb = this.timeSheetService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    //this.monthWeeklyList=[{"value":"31/01/2022 - 06/02/2022","label":"31st Jan to 06th Feb 2022"},{"value":"07/02/2022 - 13/02/2022","label":"07th Feb to 13th Feb 2022"},{"value":"14/02/2022 - 20/02/2022","label":"14th Feb to 20th Feb 2022"},{"value":"21/02/2022 - 27/02/2022","label":"21st Feb to 27th Feb 2022"},{"value":"28/02/2022 - 01/03/2022","label":"28th Feb to 06th Mar 2022"}]
    //this.timeSheetService.getApprovalTimeSheet();
    //this.search("");
    this.getUserList();
  }
  getUserList(){
    this.userList=[];
    this.timeSheetService.getUserList("").pipe(
      tap((res: any) => {
        this.userList = res;
        if(this.userList.length>0){
          this.filterGroup.patchValue({
            selectedUser : "0"
          });
        }
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  refresh(){
    if(this.fromDate){

      var searchTerm='';
      this.timeSheetService.patchState({ searchTerm },"/searchApprovalTimesheet");
    }else{
      alert("Select Valid Month")
    }
  }
  private getData() {
    this.attendanceService.getAttendanceComboList().pipe(
      tap((res: any) => {
        console.log("res", res);
        this.employeeMonthList = res["employee-month"];
        console.log("employeeMonthList", this.employeeMonthList);
        this.approverMonthList = res["approver-month"];
        console.log("approverMonthList", this.approverMonthList);
        this.statusList = res.status;
        console.log("statusList", this.statusList);
        this.adminSymbolList = res["admin-symbol"];
        console.log("adminSymbolList", this.adminSymbolList);
        this.employeeSymbolList = res["employee-symbol"];
        console.log("employeeSymbolList", this.employeeSymbolList);
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  private getDateRange() {
    this.attendanceService.getDateRange().pipe(
      tap((res: any) => {
        console.log("res", res);
        this.monthWeeklyList = res;
      }),
      catchError((err) => {
        console.log(err);
        return of({
          items: []
        });
      })).subscribe();
  }
  showTimeSheet(approval,timesheet){
    if(timesheet.status ==='Approved'){
      if(confirm('Are you sure you want to approve again?')){
        const modalRef = this.modalService.open(TimeTrackerApprovalComponent, { size: 'lg', animation :true });
        modalRef.componentInstance.approval = approval;
        modalRef.componentInstance.timeSheet = timesheet;
      }
    }else{
      const modalRef = this.modalService.open(TimeTrackerApprovalComponent, { size: 'lg', animation :true });
      modalRef.componentInstance.approval = approval;
      modalRef.componentInstance.timeSheet = timesheet;
    }

  }
    // filtration
    filterForm() {
      this.filterGroup = this.fb.group({
        searchTerm: [''],
        selectedUser:[''],
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
      this.timeSheetService.patchState({ filter },"/searchApprovalTimesheet");
    }

    // search
    searchForm() {
      this.searchGroup = this.fb.group({
        searchTerm: [''],
        department:['0'],
        division:['0'],
        project:['0']
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
      this.timeSheetService.patchStateWithoutFetch({fromDate:this.fromDate,toDate:this.toDate});
      this.timeSheetService.patchState({ searchTerm },"/searchApprovalTimesheet");
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
      this.timeSheetService.patchState({ sorting },"/searchApprovalTimesheet");
    }

    // pagination
    paginate(paginator: PaginatorState) {
      this.timeSheetService.patchState({ paginator },"/searchApprovalTimesheet");
    }
    // form actions
    setMonth(value){
      var position =value.split(" - ");
      if(position.length>1){
        this.fromDate=position[0];
        this.toDate=position[1];
        var searchTerm='';
        this.timeSheetService.patchStateWithoutFetch({fromDate:this.fromDate,toDate:this.toDate});
        this.timeSheetService.patchState({ searchTerm },"/searchApprovalTimesheet");
      }else{
        alert("Select Valid Month")
      }
    }
    setEmployeeId(value){

        var searchTerm='';
        this.timeSheetService.patchStateWithoutFetch({employeeId:value});
        this.timeSheetService.patchState({ searchTerm },"/searchApprovalTimesheet");

    }
    searchDates(){
      alert(this.fromDate);
      alert(this.toDate);
        var searchTerm='';
        this.timeSheetService.patchStateWithoutFetch({fromDate:this.fromDate,toDate:this.toDate});
        this.timeSheetService.patchState({ searchTerm },"/searchApprovalTimesheet");
    }
    setToDate(value){
      this.toDate=value;
    }
    setFromDate(value){
      this.fromDate=value;
    }
    clearFilter(){

      if(this.isClearFilter){
        (<HTMLInputElement>document.getElementById("searchText")).value="";
        this.timeSheetService.setDefaults();
       // this.timeSheetService.patchState({ searchTerm },"/searchApprovalTimesheet");
        this.grouping = this.timeSheetService.grouping;
        this.paginator = this.timeSheetService.paginator;
        this.sorting = this.timeSheetService.sorting;
      }else{
        (<HTMLInputElement>document.getElementById("searchText")).value="";
      }
    }
}
