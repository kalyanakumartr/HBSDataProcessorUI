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
import { Workflow } from '../_models/workflow.model';

const DEFAULT_STATE: IGroupTeamTableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortGroupTeam(),
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

export class GroupTeamService extends TableService<Team> implements OnDestroy {
    _taskTableState$ = new BehaviorSubject<IGroupTeamTableState>(DEFAULT_STATE);
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
    this.patchStateWithoutFetch({departmentId:'',divisionId:'',groupId:'', searchTerm:''  });
  }
  public patchStateWithoutFetch(patch: Partial<IGroupTeamTableState>) {
    const newState = Object.assign(this._taskTableState$.value, patch);
    this._taskTableState$.next(newState);
  }
  getTeamUserList(groupId){

    const url = this.VIEW_API_URL + "/getTeamUserList";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, { "teamId":groupId},{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );

  }
  getTeamListBasedOnSkill(skill, groupId){
    var paramAdded ="";
    if(groupId){
      paramAdded = "/"+groupId;
    }
    const url = this.API_URL + "/getTeamList"+"/"+skill+paramAdded;
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
  getAllocationGroup(allotmentId){
    const url =`${this.VIEW_API_URL}/getAllocationGroup`;
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<Workflow>(url, {"allotmentId":allotmentId  },{ headers: httpHeaders, });
  }
  getGroupTeam(teamId){

    const url =`${this.VIEW_API_URL}/getGroupTeam`;
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<Team>(url, {"formGroup":{"teamId":teamId}  },{ headers: httpHeaders, });
  }
  createGroupTeam(groupTeam, divisionId, employeeId, parentGroupId, path ){
    const url = this.VIEW_API_URL + path;
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {formGroup :groupTeam,parentGroupId:parentGroupId,divisionId:divisionId,employeeId:employeeId},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  updateGroupTeam(groupTeam, divisionId, employeeId, parentGroupId, path ){
    const url = this.VIEW_API_URL + path;
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {formGroup :groupTeam,parentGroupId:parentGroupId,divisionId:divisionId,employeeId:employeeId},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
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
