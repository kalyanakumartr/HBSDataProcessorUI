import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GroupingState, IProjectTableState, PaginatorState, SortStateProject, TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthHTTPService } from './auth-http';
import { Department } from '../_models/department.model';
import { Project } from '../_models/project.model';
import { Team } from '../_models/team.model';
import { SubCountry } from '../_models/sub-country.model';
import { Process } from '../../time-tracker/modal/process.model';

const DEFAULT_STATE: IProjectTableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortStateProject(),
  searchTerm: '',
  divisionId: '',
  departmentId: '',
  projectId: '',
  groupId:'',
  teamId:'',
  type:'',
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

export class ProjectService extends TableService<Project> implements OnDestroy {
    _taskTableState$ = new BehaviorSubject<IProjectTableState>(DEFAULT_STATE);
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

  getDepartmentList(){

    const url = this.API_URL + "/getDepartmentList";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<Department[]>(url, {},{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }


  getDeliveryModeList(){

    const url = this.VIEW_API_URL + "/getDeliveryModeList";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    //withmodel
    //return this.http.post<UomDetail[]>(url, {},{headers: httpHeaders}).pipe(
      //without Model
      return this.http.post(url, {},{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  getUomList(){

    const url = this.VIEW_API_URL + "/getUnitMeasurementList";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    //withmodel
    //return this.http.post<UomDetail[]>(url, {},{headers: httpHeaders}).pipe(
      //without Model
      return this.http.post(url, {},{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  getDeliveryTypeList(){

    const url = this.VIEW_API_URL + "/getDeliveryTypeList";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    //withmodel
    //return this.http.post<UomDetail[]>(url, {},{headers: httpHeaders}).pipe(
      //without Model
      return this.http.post(url, {},{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }


  getDivisionList(department){

    const url = this.API_URL + "/getDivisionList"+"/"+department;
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {"searchTerm":""},{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  getProjectList(division){

    const url = this.VIEW_API_URL + "/getProjectList"+"/"+division;
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<Project[]>(url, {},{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  getProjectById(id: string): Observable<Project> {

    const url =`${this.VIEW_API_URL}/getProject/${id}`;
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<Project>(url, {  },{ headers: httpHeaders, });
  }

  getGroupList(division){

    const url = this.API_URL + "/getGroupList/"+division;
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<Team[]>(url, {},{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  getTeamList(groupId){

    const url = this.API_URL + "/getTeamList/"+groupId;
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<Team[]>(url, {},{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  getSubCountryList(projectId){
    const url = this.VIEW_API_URL + "/getSubCountryList";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<Array<SubCountry>>(url, {"projectId":projectId},{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  getProjectSubCountryList(projectId){
    alert("ProjectId"+projectId);
    const url = this.VIEW_API_URL + "/getSubCountryList";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<Array<SubCountry>>(url, {"projectId":projectId},{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  getUserListByRoles(divisionId, roleShortNames,search){

    const url = this.API_URL + "/getUserListByRoles";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {
      "roleShortNames": roleShortNames,
      "divisionId":divisionId?divisionId:"",
      "searchParam":search
  },{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  createSubCountry(subCountry, path, ){
    const url = this.VIEW_API_URL + path;
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, subCountry,{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  assignSubCountryToProject(subCountryArray, projectId, path, ){
    const url = this.VIEW_API_URL + path;
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {"countryList":subCountryArray,"projectId":projectId},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  getProcessList(projectId){
    const url = this.VIEW_API_URL + "/getProcessList";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<Array<Process>>(url, {"projectId":projectId},{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  createProcess(process, path, ){
    const url = this.VIEW_API_URL + path;
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url,{"formProcess": process},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  assignProcessToProject(processArray, projectId, path, ){
    const url = this.VIEW_API_URL + path;
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {"ProcessList":processArray,"projectId":projectId},{headers: httpHeaders}).pipe(
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
