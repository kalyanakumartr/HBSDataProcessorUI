import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GroupingState,  ITeamTransferTableState, PaginatorState,  SortTeamTransfer, TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthHTTPService } from './auth-http';
import { TeamTransfer } from '../_models/team-transfer.model';

const DEFAULT_STATE: ITeamTransferTableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortTeamTransfer(),
  searchTerm: '',
  divisionId: '',
  departmentId: '',
  type:'',
  clientName:'',
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

export class TeamTransferService extends TableService<TeamTransfer> implements OnDestroy {
    _taskTableState$ = new BehaviorSubject<ITeamTransferTableState>(DEFAULT_STATE);
    isLoadingSubject: BehaviorSubject<boolean>;
    protected http: HttpClient;
  API_URL = `${environment.adminApiUrl}`;
  VIEW_API_URL = `${environment.viewApiUrl}`;
  private _errorMsg: any;
  constructor(@Inject(HttpClient) http, private authHttpService: AuthHTTPService,) {
    super(http);
    this._tableState$ = this._taskTableState$;
  }

  public setDefaults() {
    this.patchStateWithoutFetch({departmentId:'',divisionId:'',groupId:'',searchTerm:''  });
  }
  public patchStateWithoutFetch(patch: Partial<ITeamTransferTableState>) {
    const newState = Object.assign(this._taskTableState$.value, patch);
    this._taskTableState$.next(newState);
  }
  getTransferUserList(shortNameList, department,division, userListType){

    const url = this.VIEW_API_URL + "/getTransferUserList";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {roleShortNames : shortNameList, "type" :userListType,"department":department, "division":division },{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );

  }
  transferUserList(userList, transferReportees,type, transferDetail){

    const url = this.VIEW_API_URL + "/transferUsers";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {"userList" : userList, "transferReportees":transferReportees, "type":type,"transferDetail":transferDetail },{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );

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
