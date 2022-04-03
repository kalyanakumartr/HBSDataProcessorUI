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
import { DailyActivities } from '../../time-tracker/modal/daily-activities.model';
import { Process } from '../../time-tracker/modal/process.model';
import { UpdateDailyLog } from '../../time-tracker/modal/update-dailylog.model';
import { GetDailyLog } from '../../time-tracker/modal/getDailyLog.model';


@Injectable({
  providedIn: 'root'
})
export class DailyLogService  {
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
    // public fields
    isLoadingSubject: BehaviorSubject<boolean>;
    protected http: HttpClient;
  API_URL = `${environment.viewApiUrl}`;
  API_ADMIN_URL = `${environment.adminApiUrl}`;
  TALE_API_URL = `${environment.taleApi}`;
  constructor(@Inject(HttpClient) http, private authHttpService: AuthHTTPService,) {
    this.http=http;
  }

  getDailyActivities(date){

    const url = this.API_URL + "/getDailyActivities";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });

    return this.http.post<DailyActivities>(url, {"date":date},{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  getDailyActivitiesWithEmpId(date,empId){

    const url = this.API_URL + "/getDailyActivities";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });

    return this.http.post<DailyActivities>(url, {"date":date,"employeeIds":[empId]},{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  timesheetApprovalReject(date,timesheetId, status, comments){

    const url = this.TALE_API_URL + "/approveTimesheet";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {"date" : date, "timesheetIds":[timesheetId] ,"etstatus":status,"comments":comments },{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  getProcessList(projectId){
    const url = this.API_URL + "/getProcessList";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<Process>(url, {"projectId" : projectId  },{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  submitDailyLog(date:String){

    const url = this.API_URL + "/submitDailyLog";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {"date":date,"comments":" "} ,{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  updateDailyLog(updateDailyLog:UpdateDailyLog){

    const url = this.API_URL + "/saveDailyLog";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, updateDailyLog ,{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  deleteDailyLog(id){

    const url = this.API_URL + "/deleteDailyLog";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {"autoId":id },{headers: httpHeaders}).pipe(
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
  private _listners = new Subject<any>();
  listen(): Observable<any>{
    return this._listners.asObservable();
  }
  filterData(filterBy:string){
    this._listners.next(filterBy)
  }
}
