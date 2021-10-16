import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http';
import { RoleModel } from '../_models/role.model';
import { Department } from '../_models/department.model';
import { Project } from '../_models/project.model';
import { Team } from '../_models/team.model';


@Injectable({
  providedIn: 'root'
})
export class ProjectService  {
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
    // public fields
    isLoadingSubject: BehaviorSubject<boolean>;
    protected http: HttpClient;
  API_URL = `${environment.adminApiUrl}`;
  constructor(@Inject(HttpClient) http, private authHttpService: AuthHTTPService,) {
    this.http=http;
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

  getGroupList(userId, roleId){

    const url = this.API_URL + "/getGroupList/"+userId+"/"+roleId;
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

  getTeamList(userId, groupId){

    const url = this.API_URL + "/getTeamList/"+userId+"/"+groupId;
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

  public getAuthFromLocalStorage(): AuthModel {
    try {
      const authData = JSON.parse(
        localStorage.getItem(this.authLocalStorageToken)
      );
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

}
