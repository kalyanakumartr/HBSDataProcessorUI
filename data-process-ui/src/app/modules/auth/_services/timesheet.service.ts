import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthHTTPService } from './auth-http';
import { AttendanceModel } from '../../attendance/modal/attendance.model';
import { TableAttendanceService } from 'src/app/_metronic/shared/crud-table/services/table.attendance.service';
import { TimeSheetModel } from '../../attendance/modal/timesheet.model';

@Injectable({
  providedIn: 'root'
})
export class TimeSheetService  extends TableAttendanceService<TimeSheetModel> implements OnDestroy {
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

  getMonthAttendanceWithTimeSheet(){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside Search TimeSheet");
    const url = this.API_ADMIN_URL + '/searchTimesheet';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    let formData: FormData = new FormData();
    return this.http.post(url, formData,{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('Error in Search TimeSheet', err);
        return of("Error in Search TimeSheet");
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
