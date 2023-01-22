import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthHTTPService } from './auth-http';
import { TableApprovalService } from 'src/app/_metronic/shared/crud-table/services/table.attendanceapproval.service';
import { Approval } from '../../time-tracker/modal/approval.model';

@Injectable({
  providedIn: 'root'
})
export class TimeSheetApprovalService  extends TableApprovalService<Approval> implements OnDestroy {
    // public fields
    isLoadingSubject: BehaviorSubject<boolean>;
    private _errorMsg = new BehaviorSubject<string>('');
    protected http: HttpClient;
    API_ADMIN_URL = `${environment.adminApiUrl}`;
    TALE_API_URL = `${environment.taleApi}`;

  constructor(@Inject(HttpClient) http, private authHttpService: AuthHTTPService,) {
    super(http);
    this.API_URL = `${environment.taleApi}`;

  }
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  getApprovalTimeSheet(){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside Search approval TimeSheet");
    const url = this.TALE_API_URL + '/searchApprovalTimesheet';
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
  getUserList(divisionId){
    const url = this.API_ADMIN_URL + '/getUserList';
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    //this.isLoadingSubject.next(true);
    console.log("Inside get Hold Reason");
    return this.http.post(url, {
      "divisionId":divisionId,
      "searchParam":"",
    },{
      headers: httpHeaders,
    });
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
