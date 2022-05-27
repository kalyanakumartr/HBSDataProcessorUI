import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from './table.service';
import { BehaviorSubject } from 'rxjs';
import { GroupingState, IAttendanceTableState, MonthPaginatorState, PaginatorState, SortStateAttendance } from '..';

const DEFAULT_STATE: IAttendanceTableState = {
  filter: {},
  paginator: new MonthPaginatorState(),
  sorting: new SortStateAttendance(),
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
  workUnitId:  '',
  startWUMiles: '',
  endWUMiles: '',
  reasonId: '',
  roadTypeMapId: '',
  startAssignedDate: '',
  startProcessedDate: '',
  receivedDate: '',
  endAssignedDate: '',
  endProcessedDate: '',
  endReceivedDate: '',
  teamName: '',
  subCountryId: '',
  isAdvanceSearch:false,
  queueList:[],
  taskStatusList:[]

};
export class TableAttendanceService<AttendanceModel> extends TableService<AttendanceModel> {
  private _taskTableState$ = new BehaviorSubject<IAttendanceTableState>(DEFAULT_STATE);

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
  public patchStateWithoutFetch(patch: Partial<IAttendanceTableState>) {
    const newState = Object.assign(this._taskTableState$.value, patch);
    this._taskTableState$.next(newState);
  }
  public setValues(empId,queue,status) {

    this.patchStateWithoutFetch({ employeeId: empId });
    this.patchStateWithoutFetch({ queueList: [queue]});
    this.patchStateWithoutFetch({ taskStatusList: [status] });

  }
}
