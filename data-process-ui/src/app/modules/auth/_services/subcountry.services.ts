import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  GroupingState, ISubcountryTableState, PaginatorState,   SortSubcountry,  TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import {  catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthHTTPService } from './auth-http';

import { SubCountry } from '../_models/sub-country.model';



const DEFAULT_STATE: ISubcountryTableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortSubcountry(),
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

export class SubcountryService extends TableService<SubCountry> implements OnDestroy {
    _taskTableState$ = new BehaviorSubject<ISubcountryTableState>(DEFAULT_STATE);
    isLoadingSubject: BehaviorSubject<boolean>;
    protected http: HttpClient;
  API_URL = `${environment.adminApiUrl}`;
  VIEW_API_URL = `${environment.viewApiUrl}`;
  private _errorMsg: any;
  constructor(@Inject(HttpClient) http, private authHttpService: AuthHTTPService,) {
    super(http);
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this._tableState$ = this._taskTableState$;
  }
  public setDefaults() {
    this.patchStateWithoutFetch({departmentId:'',divisionId:'',searchTerm:'' ,projectId:'' });
  }
  public patchStateWithoutFetch(patch: Partial<ISubcountryTableState>) {
    const newState = Object.assign(this._taskTableState$.value, patch);
    this._taskTableState$.next(newState);
  }
  getSubcountryList(){

    const url = this.VIEW_API_URL + "/searchSubCountry";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, { },{headers: httpHeaders}).pipe(
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
  listen(): Observable<any>{switchMap
    return this._listners.asObservable();
  }
  filterData(filterBy:string){
    this._listners.next(filterBy)
  }
  filterAssetData(filterBy:string){
    this._listners.next(filterBy)
  }
}
