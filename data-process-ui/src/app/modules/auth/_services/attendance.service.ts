import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthHTTPService } from './auth-http';
import { Attendance } from '../../attendance/modal/attendance.model';
import { MarkAttendanceModel } from '../../attendance/modal/mark-attendance.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService  extends TableService<Attendance> implements OnDestroy {
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

    return this.http.post<MarkAttendanceModel>(url, {},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('Error in get Attendance', err);
        return of("Error in get Attendance");
      })
    );
  }
  markAttendance(symbol,currentDate){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside mark attendance");
    const url = this.API_ADMIN_URL + '/markAttendance';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });

    return this.http.post(url, {'symbol': symbol,'date':currentDate},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('Error in mark Attendance', err);
        return of("Error in mark Attendance");
      })
    );
  }
  getMonthAttendance(){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside mark attendance");
    const url = this.API_ADMIN_URL + '/getmonthAttendance';
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
}
