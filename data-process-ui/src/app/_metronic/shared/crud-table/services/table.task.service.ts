import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from './table.service';
import { BehaviorSubject } from 'rxjs';
import { GroupingState, ITaskTableState, PaginatorState, SortState } from '..';

const DEFAULT_STATE: ITaskTableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined,
  employeeId: '',
  queueList:[],
  taskStatusList:[]

};
export class TableTaskService<WorkUnitModel> extends TableService<any> {
  private _taskTableState$ = new BehaviorSubject<ITaskTableState>(DEFAULT_STATE);
  // private employeeId = new BehaviorSubject<string>('');
  // private queueList = new BehaviorSubject<string[]>([]);
  // private taskStatusList = new BehaviorSubject<string[]>([]);

  constructor(@Inject(HttpClient) http) {
    super(http);
    //this._taskTableState$. = []
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
    this.patchStateWithoutFetch({ queueList: []});
    this.patchStateWithoutFetch({ taskStatusList: [] });

  }
  public patchStateWithoutFetch(patch: Partial<ITaskTableState>) {
    const newState = Object.assign(this._taskTableState$.value, patch);
    this._taskTableState$.next(newState);
  }
}
