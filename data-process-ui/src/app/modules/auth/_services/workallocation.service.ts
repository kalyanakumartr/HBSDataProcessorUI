import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { UserModel } from '../_models/user.model';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http';
import { UserITModel } from '../_models/user-it.model';
import { UserHRModel } from '../_models/user-hr.model';
import { WorkUnitModel } from '../../web-upload/modal/work-unit.model';
import { TableTaskService } from 'src/app/_metronic/shared/crud-table/services/table.task.service';


@Injectable({
  providedIn: 'root'
})
export class WorkAllocationService extends TableTaskService<WorkUnitModel> implements OnDestroy {

    // public fields
    isLoadingSubject: BehaviorSubject<boolean>;
    private _errorMsg = new BehaviorSubject<string>('');

  API_URL = `${environment.viewApiUrl}`;
  constructor(@Inject(HttpClient) http, private authHttpService: AuthHTTPService,) {
    super(http);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  getWorkUnitList(queue,status){
    const url = this.API_URL + '/searchTask';
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    this.isLoadingSubject.next(true);
    console.log("Inside get Work Units");
    return this.http.post(url, {
      "searchTerm": "",
      "entityId": null,
      "queueList": [
          queue
      ],
      "taskStatusList": [
        status
    ],
    },{
      headers: httpHeaders,
    });
  }

  getQueueForUser(user){
    const url = 'http://localhost:3000/queue' ;
    console.log(this.http.get(url));
    return this.http.get<string[]>(url);
    /*const url = this.API_URL + '/getQueueList';
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    this.isLoadingSubject.next(true);
    console.log("Inside get Work Units");
    return this.http.post(url, {
      "searchTerm": user,

    },{
      headers: httpHeaders,
    });*/
  }
  getStatusForQueue(queue){
    console.log("Queue",queue);
    const url = 'http://localhost:3000/status' ;
    return this.http.get<string[]>(url);
   /* const url = this.API_URL + '/getStatusList';
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    this.isLoadingSubject.next(true);
    console.log("Inside get Status");
    return this.http.post(url, {
      "searchTerm": queue,

    },{
      headers: httpHeaders,
    });*/
  }

}
