import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthHTTPService } from './auth-http';
import { TableAttendanceService } from 'src/app/_metronic/shared/crud-table/services/table.attendance.service';
import { LeaveModel } from '../../leave-management-system/modal/leave.model';
import { TableLeaveService } from 'src/app/_metronic/shared/crud-table/services/table.leave.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveService  extends TableLeaveService<LeaveModel> implements OnDestroy {
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

  applyLeave(leave:LeaveModel){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside Apply Leave");
    const url = this.API_ADMIN_URL + '/applyLeave';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });

    return this.http.post(url, leave,{headers: httpHeaders});
  }
  cancelLeave(leaveId:any){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside Cancel Leave");
    const url = this.API_ADMIN_URL + '/cancelLeave';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });

    return this.http.post(url, {leaveId},{headers: httpHeaders});
  }
  getLeaveHistory(){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside  Leave History");
    const url = this.API_ADMIN_URL + '/searchLeave';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    let formData: FormData = new FormData();
    return this.http.post(url, formData,{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('Error in Leave History', err);
        return of("Error in Leave History");
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
