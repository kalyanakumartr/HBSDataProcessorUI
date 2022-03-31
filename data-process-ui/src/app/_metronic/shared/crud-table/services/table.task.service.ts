import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from './table.service';
import { BehaviorSubject } from 'rxjs';
import { GroupingState, ITaskTableState, PaginatorState, SortState, SortStateTable } from '..';

const DEFAULT_STATE: ITaskTableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortStateTable(),
  searchTerm: '',
  divisionId: '',
  departmentId: '',
  projectId: '',
  grouping: new GroupingState(),
  entityId: undefined,
  employeeId: '',
  fromDate: '',
  toDate: '',
  status: '',
  queueList:[],
  taskStatusList:[]

};
export class TableTaskService<WorkUnitModel> extends TableService<WorkUnitModel> {
  private _taskTableState$ = new BehaviorSubject<ITaskTableState>(DEFAULT_STATE);

  constructor(@Inject(HttpClient) http) {
    super(http);
    this._tableState$ = this._taskTableState$;
  }
  get employeeId() {
    return this._taskTableState$.value.employeeId;
  }
  get queueList$() {
    return this.queueList$.asObservable();
  }
  get taskStatusList$() {
    return this.taskStatusList$.asObservable();
  }

  public setDefaults() {

    this.patchStateWithoutFetch({ employeeId: '' });
    this.patchStateWithoutFetch({ queueList: ['Group']});
    this.patchStateWithoutFetch({ taskStatusList: ['Ready'] });

  }
  public patchStateWithoutFetch(patch: Partial<ITaskTableState>) {
    const newState = Object.assign(this._taskTableState$.value, patch);
    this._taskTableState$.next(newState);
  }
  public setValues(empId,queue,status) {

    this.patchStateWithoutFetch({ employeeId: empId });
    this.patchStateWithoutFetch({ queueList: [queue]});
    this.patchStateWithoutFetch({ taskStatusList: [status] });

  }
}
