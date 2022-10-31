import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GroupingState, IGroupTeamTableState, IProjectTableState, PaginatorState, SortGroupTeam, SortStateProject, TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthHTTPService } from './auth-http';
import { Department } from '../_models/department.model';
import { Project } from '../_models/project.model';
import { Team } from '../_models/team.model';
import { SubCountry } from '../_models/sub-country.model';
import { Process } from '../../time-tracker/modal/process.model';

const DEFAULT_STATE: IGroupTeamTableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortGroupTeam(),
  searchTerm: '',
  divisionId: '',
  departmentId: '',
  projectId: '',
  groupId:'',
  teamId:'',
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
  isDirectReport:true,
  queueList:[],
  taskStatusList:[]

};

@Injectable({
  providedIn: 'root'
})

export class GroupTeamService extends TableService<Team> implements OnDestroy {
    _taskTableState$ = new BehaviorSubject<IGroupTeamTableState>(DEFAULT_STATE);
    isLoadingSubject: BehaviorSubject<boolean>;
    protected http: HttpClient;
  API_URL = `${environment.adminApiUrl}`;
  VIEW_API_URL = `${environment.viewApiUrl}`;
  private _errorMsg: any;
  constructor(@Inject(HttpClient) http, private authHttpService: AuthHTTPService,) {
    super(http);
    this._tableState$ = this._taskTableState$;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  private _listners = new Subject<any>();
  listen(): Observable<any>{
    return this._listners.asObservable();
  }
  filterData(filterBy:string){
    this._listners.next(filterBy)
  }
  filterAssetData(filterBy:string){
    this._listners.next(filterBy)
  }
}
