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
import { TimeTrackerComponent } from '../../time-tracker/time-tracker/time-tracker.component';
import { AttendanceModel } from '../modal/attendance.model';
import { LabelValueModel } from '../modal/value-lable.model';

@Component({
  selector: 'app-individual-attendance',
  templateUrl: './individual-attendance.component.html',
  styleUrls: ['./individual-attendance.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class IndividualAttendanceComponent implements OnInit,
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
  attendanceList:AttendanceModel[];
  employeeMonthList:LabelValueModel[];
  statusList:LabelValueModel[];
  approverMonthList:LabelValueModel[];
  adminSymbolList:LabelValueModel[];
  employeeSymbolList:LabelValueModel[];
  private subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    public modalService: NgbModal,
    private snackBar: MatSnackBar,
    private _router: Router,
    public attendanceService: AttendanceService,
    public timeSheetService: TimeSheetService) {
      this.timeSheetService.listen().subscribe((m:any)=>{
        console.log("m -- -- --",m);
        this.filter();
      });
    }

  ngOnInit(): void {

    // this.fromDate="01/01/2022";
    // this.toDate="31/01/2022";
    this.getData();
    //this.search("");
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
  addTimeSheet(timeSheet){
    if(timeSheet.attendance.symbol == 'P8' || timeSheet.attendance.symbol == 'P12' || timeSheet.attendance.symbol == 'P4'){
      const modalRef = this.modalService.open(TimeTrackerComponent, { size: 'lg', animation :true });
      modalRef.componentInstance.timeSheet = timeSheet;
    }else{
      alert("Attendance Not Marked Yet");
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
      this.timeSheetService.patchState({ filter },"/searchTimesheet");
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
      this.timeSheetService.patchState({ searchTerm },"/searchTimesheet");
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
      this.timeSheetService.patchState({ sorting },"/searchTimesheet");
    }

    // pagination
    paginate(paginator: PaginatorState) {
      this.timeSheetService.patchState({ paginator },"/searchTimesheet");
    }
    // form actions
    setMonth(value){
      var position =value.split(" - ");
      if(position.length>1){
        this.fromDate=position[0];
        this.toDate=position[1];
        var searchTerm='';
        this.timeSheetService.patchStateWithoutFetch({fromDate:this.fromDate,toDate:this.toDate});
        this.timeSheetService.patchState({ searchTerm },"/searchTimesheet");
      }else{
        alert("Select Valid Month")
      }
    }
    refresh(){
      if(this.fromDate){

        var searchTerm='';
        this.timeSheetService.patchState({ searchTerm },"/searchTimesheet");
      }else{
        alert("Select Valid Month")
      }
    }
    searchDates(){
      alert(this.fromDate);
      alert(this.toDate);
        var searchTerm='';
        this.timeSheetService.patchStateWithoutFetch({fromDate:this.fromDate,toDate:this.toDate});
        this.timeSheetService.patchState({ searchTerm },"/searchTimesheet");
    }
    setToDate(value){
      this.toDate=value;
    }
    setFromDate(value){
      this.fromDate=value;
    }

}
