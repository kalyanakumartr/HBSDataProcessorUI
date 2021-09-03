import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GroupingState,   ISortView, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { RoleService } from '../../auth/_services/role.services';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements
OnInit,
OnDestroy,
ISortView {
paginator: PaginatorState;
sorting: SortState;
grouping: GroupingState;
isLoading: boolean;
filterGroup: FormGroup;
searchGroup: FormGroup;

  userList: any;
  private subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder,
    private modalService: NgbModal, public roleService: RoleService) {

  }

  ngOnInit(): void {
     this.roleService.fetch("/getActiveRoleList");
    console.log("Roles List :", this.subscriptions)
    this.grouping = this.roleService.grouping;
    this.paginator = this.roleService.paginator;
    this.sorting = this.roleService.sorting;
    const sb = this.roleService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
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
    this.roleService.patchState({ searchTerm },"/getActiveRoleList");
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
    this.roleService.patchState({ sorting },"/getActiveRoleList");
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.roleService.patchState({ paginator },"/getActiveRoleList");
  }
}

