import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http';
import { RoleModel } from '../_models/role.model';
import { Department } from '../_models/department.model';
import { Project } from '../_models/project.model';
import { Team } from '../_models/team.model';
import { SubCountry } from '../_models/sub-country.model';


@Injectable({
  providedIn: 'root'
})
export class ProjectService extends TableService<Project> implements OnDestroy {
 // private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
    // public fields
    isLoadingSubject: BehaviorSubject<boolean>;
    protected http: HttpClient;
  API_URL = `${environment.adminApiUrl}`;
  VIEW_API_URL = `${environment.viewApiUrl}`;
  constructor(@Inject(HttpClient) http, private authHttpService: AuthHTTPService,) {
    super(http);
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

    const url = this.API_URL + "/getProjectList"+"/"+division;
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
    const url = this.VIEW_API_URL + "/getProjectSubCountryList";
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
