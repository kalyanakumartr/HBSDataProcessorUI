import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GroupingState, IProjectTableState, IRoadTypeTableState, PaginatorState, SortStateRoadType, TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthHTTPService } from './auth-http';
import { RoadType } from '../_models/road-type.model';
import { POLimit } from '../_models/po-limit.model';

const DEFAULT_STATE: IRoadTypeTableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortStateRoadType(),
  searchTerm: '',
  divisionId: '',
  departmentId: '',
  projectId: '',
  groupId:'',
  teamId:'',
  type:'',
  clientName:'',
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

export class RoadtypeService extends TableService<RoadType> implements OnDestroy {
    _taskTableState$ = new BehaviorSubject<IRoadTypeTableState>(DEFAULT_STATE);
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
  getPOList(id){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }


    console.log("Inside PO List");
    const url = this.VIEW_API_URL + '/searchPOLimit';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<POLimit>(url, {"poDetailId":  id },{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  addPOLimit(poLimit: POLimit, path:string){
    const url = this.VIEW_API_URL + path;
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url,{"poLimit": poLimit},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  deletePOLimit(poLimit: POLimit, path:string){
    const url = this.VIEW_API_URL + path;
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url,{"poLimit": poLimit},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
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
