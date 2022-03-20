import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { GroupingState, IFilterView, IGroupingView, ISearchView, ISortView, PaginatorState, SortStateAttendance, SortStateLeave } from 'src/app/_metronic/shared/crud-table';
import { LeaveService } from '../auth/_services/leave.services';
import { UsersService } from '../auth/_services/user.service';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';

@Component({
  selector: 'app-leave-management-system',
  templateUrl: './leave-management-system.component.html',
  styleUrls: ['./leave-management-system.component.scss']
})
export class LeaveManagementSystemComponent implements OnInit,
ISortView,
IFilterView,
IGroupingView,
ISearchView,
IFilterView {
  paginator: PaginatorState;
  sorting: SortStateLeave;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  fromDate:string;
  toDate:string;
  subscriptions: any;
  constructor(
    private fb: FormBuilder,
    public modalService: NgbModal,
    private snackBar: MatSnackBar,
    private _router: Router,
    public leaveService: LeaveService) {
      this.leaveService.listen().subscribe((m:any)=>{
        console.log("m -- -- --",m);
        this.filter();
      });
    }
  ngOnInit(): void {
    this.fromDate='01/01/2022';
    this.toDate='31/12/2022';
    this.search('');
    this.leaveService.items$
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"bottom"
    });
  }
  applyLeave(id: number) {
    const modalRef = this.modalService.open(ApplyLeaveComponent, { size: 'xl' });
    modalRef.componentInstance.id = id;

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
  this.leaveService.patchState({ filter },"/searchLeave");
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
      this.leaveService.patchStateWithoutFetch({fromDate:this.fromDate,toDate:this.toDate});
      this.leaveService.patchState({ searchTerm },"/searchLeave");
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
      this.leaveService.patchState({ sorting },"/searchLeave");
    }

    // pagination
    paginate(paginator: PaginatorState) {
      this.leaveService.patchState({ paginator },"/searchLeave");
    }
    // form actions
    setMonth(value){
      var position =value.split(" - ");
      if(position.length>1){
        this.fromDate=position[0];
        this.toDate=position[1];
        var searchTerm='';
        this.leaveService.patchStateWithoutFetch({fromDate:this.fromDate,toDate:this.toDate});
        this.leaveService.patchState({ searchTerm },"/searchLeave");
      }else{
        alert("Select Valid Month")
      }
    }
    searchDates(){
        var searchTerm='';
        this.leaveService.patchStateWithoutFetch({fromDate:this.fromDate,toDate:this.toDate});
        this.leaveService.patchState({ searchTerm },"/searchLeave");
    }
    setToDate(value){
      this.toDate=value;
    }
    setFromDate(value){
      this.fromDate=value;
    }
    clearFilter(){


    }
    cancel(leaveId){
      const sbUpdate = this.leaveService.cancelLeave(leaveId).pipe(
        tap(() => {
          this.leaveService.filterAssetData("");
          this.search('');
        }),
        catchError((errorMessage) => {
          this.openSnackBar(errorMessage,"X");
          return of();
        }),
      ).subscribe(res =>this.openSnackBar(res,"!!"));
    }
}

