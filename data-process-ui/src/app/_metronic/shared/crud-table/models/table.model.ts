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
  groupId:string;
  teamId:string;
  type:string;//Group or Team
  fromDate: string;
  toDate: string;
  status: string;
  clientName:any;
  workUnitId: string;
  startWUMiles:string;
  endWUMiles:string;
  reasonId:string;
  roadTypeMapId:string;
  startAssignedDate:string;
  startProcessedDate:string;
  receivedDate:string;
  endAssignedDate:string;
  endProcessedDate:string;
  endReceivedDate:string;
  teamName:string;
  subCountryId:string;
  isAdvanceSearch:boolean;
  isDirectReport:boolean;
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
export interface ILeaveTableState extends ITableState{
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
export interface IProjectTableState extends ITableState{
  employeeId: any,
  queueList:any,
  projectId:any,
  fromDate:any,
  toDate:any;
  status:any;
  taskStatusList:any;
  clientName:any;
}
export interface IProcessTableState extends ITableState{
  employeeId: any,
  queueList:any,
  projectId:any,
  fromDate:any,
  toDate:any;
  status:any;
  taskStatusList:any
}
export interface ISubcountryTableState extends ITableState{
  employeeId: any,
  queueList:any,
  projectId:any,
  fromDate:any,
  toDate:any;
  status:any;
  taskStatusList:any
}
export interface IWorkflowTableState extends ITableState{
  employeeId: any,
  queueList:any,
  projectId:any,
  fromDate:any,
  toDate:any;
  status:any;
  taskStatusList:any
}
export interface IGroupTeamTableState extends ITableState{
  employeeId: any,
  queueList:any,
  projectId:any,
  fromDate:any,
  toDate:any;
  status:any;
  taskStatusList:any
}
export interface ITeamTransferTableState extends ITableState{
  employeeId: any,
  queueList:any,
  projectId:any,
  fromDate:any,
  toDate:any;
  status:any;
  taskStatusList:any
}

export interface IRoadTypeTableState extends ITableState{
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
  headerList: T[];
  total: number;
  leaveBalanceCount:number;
  approvedLeaveCount:number;
  unApprovedLeaveCount:number;
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

