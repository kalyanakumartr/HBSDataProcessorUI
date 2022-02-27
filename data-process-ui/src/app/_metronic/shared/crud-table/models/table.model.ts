import { GroupingState } from './grouping.model';
import { PaginatorState } from './paginator.model';
import { SortState } from './sort.model';

export interface ITableState {
  filter: {};
  paginator: PaginatorState;
  sorting: SortState;
  searchTerm: string;
  divisionId:string;
  departmentId: string;
  projectId: string;
  fromDate: string;
  toDate: string;
  status: string;
  grouping: GroupingState;
  entityId: number | undefined;
}

export interface ITaskTableState extends ITableState{
  employeeId: any,
  queueList:any,
  projectId:any,
  fromDate:any,
  toDate:any;
  status:any;
  taskStatusList:any
}
export interface IAttendanceTableState extends ITableState{
  employeeId: any,
  queueList:any,
  projectId:any,
  fromDate:any,
  toDate:any;
  status:any;
  taskStatusList:any
}

export interface IApprovalTableState extends ITableState{
  employeeId: any,
  queueList:any,
  projectId:any,
  fromDate:any,
  toDate:any;
  status:any;
  taskStatusList:any
}

export interface TableResponseModel<T> {
  items: T[];
  total: number;
}

export interface ICreateAction {
  create(): void;
}

export interface IEditAction {
  edit(id: number): void;
}

export interface IDeleteAction {
  delete(id: number): void;
}

export interface IDeleteSelectedAction {
  grouping: GroupingState;
  ngOnInit(): void;
  deleteSelected(): void;
}

export interface IFetchSelectedAction {
  grouping: GroupingState;
  ngOnInit(): void;
  fetchSelected(): void;
}

export interface IUpdateStatusForSelectedAction {
  grouping: GroupingState;
  ngOnInit(): void;
  updateStatusForSelected(): void;
}

