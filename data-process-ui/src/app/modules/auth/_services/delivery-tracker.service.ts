import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthHTTPService } from './auth-http';
import { DeliveryModel } from '../../reports/models/delivery.model';


@Injectable({
  providedIn: 'root'
})
export class DeliveryTrackerService extends TableService<DeliveryModel> implements OnDestroy {

    // public fields
    isLoadingSubject: BehaviorSubject<boolean>;
    private _errorMsg = new BehaviorSubject<string>('');

  API_URL = `${environment.adminApiUrl}`;
  REPORT_API_URL = `${environment.reportsApi}`;
  constructor(@Inject(HttpClient) http, private authHttpService: AuthHTTPService,) {
    super(http);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  getUserList(){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    console.log("Inside get User List");
        return this.authHttpService.getUserList(auth.access_token).pipe(
      map((users: any) => {
        console.log("Inside get Users",users);
        return users;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  getMonthlyDateRange(){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside getMonthlyDateRange");
    const url = this.REPORT_API_URL + '/getMonthlyDateRange';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );

  }
  getWUHold(){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }


    console.log("Inside webUpload");
    const url = this.REPORT_API_URL + '/workUnitHoldReport';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<DeliveryModel>(url, {},{headers: httpHeaders}).pipe(
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
