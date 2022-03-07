import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthHTTPService } from './auth-http';
import { AttendanceModel } from '../../attendance/modal/attendance.model';
import { TableAttendanceService } from 'src/app/_metronic/shared/crud-table/services/table.attendance.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService  extends TableAttendanceService<AttendanceModel> implements OnDestroy {

    // public fields
    isLoadingSubject: BehaviorSubject<boolean>;
    private _errorMsg = new BehaviorSubject<string>('');
    protected http: HttpClient;
    API_ADMIN_URL = `${environment.adminApiUrl}`;

  constructor(@Inject(HttpClient) http, private authHttpService: AuthHTTPService,) {
    super(http);
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  getMarkedAttendance(){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside get Attendance");
    const url = this.API_ADMIN_URL + '/getAttendance';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });

    return this.http.post<AttendanceModel>(url, {},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('Error in get Attendance', err);
        return of("Error in get Attendance");
      })
    );
  }
  markAttendance(symbol,mode, currentDate){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside mark attendance");
    const url = this.API_ADMIN_URL + '/markAttendance';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });

    return this.http.post(url, {'symbol': symbol,'mode':mode,'date':currentDate},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('Error in mark Attendance', err);
        return of("Error in mark Attendance");
      })
    );
  }
  markAttendanceOnBehalf(symbol,mode, currentDate, employeeIds){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside mark Attendance On Behalf");
    const url = this.API_ADMIN_URL + '/markAttendanceOnBehalf';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });

    return this.http.post(url, {'symbol': symbol,'mode':mode,'date':currentDate,'employeeIds':[employeeIds]},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('Error in mark Attendance On Behalf', err);
        return of("Error in mark Attendance On Behalf");
      })
    );
  }
  getMonthAttendance(){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside mark attendance");
    const url = this.API_ADMIN_URL + '/searchAttendance';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    let formData: FormData = new FormData();
    return this.http.post(url, formData,{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('Error in mark Attendance', err);
        return of("Error in mark Attendance");
      })
    );
  }
  getUserListForAttendance(){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside mark attendance");
    const url = this.API_URL + '/markAttendance';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    let formData: FormData = new FormData();
    return this.http.post(url, formData,{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('Error in mark Attendance', err);
        return of("Error in mark Attendance");
      })
    );
  }
  getAttendanceComboList(){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside getAttendanceComboList");
    const url = this.API_URL + '/getAttendanceComboList';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    let formData: FormData = new FormData();
    return this.http.post(url, formData,{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('Error ingetAttendanceComboList', err);
        return of("Error in getAttendanceComboList");
      })
    );
  }
  getDateRange(){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside getDateRange");
    const url = this.API_URL + '/getDateRange';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    let formData: FormData = new FormData();
    return this.http.post(url, formData,{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('Error getDateRange', err);
        return of("Error in getDateRange");
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
