import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { UserModel } from '../_models/user.model';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http';
import { UserITModel } from '../_models/user-it.model';
import { UserHRModel } from '../_models/user-hr.model';
import { WorkUnitModel } from '../../web-upload/modal/work-unit.model';
import { TableTaskService } from 'src/app/_metronic/shared/crud-table/services/table.task.service';
import { UpdateTaskModel } from '../../web-upload/modal/update-task.model';
import { WorkUnitUpdateModel } from '../../web-upload/modal/workunitupdate.model';


@Injectable({
  providedIn: 'root'
})
export class WorkAllocationService extends TableTaskService<WorkUnitModel> implements OnDestroy {




    // public fields
    isLoadingSubject: BehaviorSubject<boolean>;
    private _errorMsg = new BehaviorSubject<string>('');

  API_URL = `${environment.viewApiUrl}`;
  ADMIN_API_URL = `${environment.adminApiUrl}`;
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
  getAssignedtoUser(selectedQueue: string) {
    /*const url = 'http://localhost:3000/getAssignedtoUser' ;
    console.log(this.http.get(url));
    return this.http.get<string[]>(url);*/
    const url = this.ADMIN_API_URL + '/getTaskUsersList/'+selectedQueue;
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    //this.isLoadingSubject.next(true);
    console.log("Inside get Work Units");
    return this.http.post(url, {
      "queueId" : ""

    },{
      headers: httpHeaders,
    });
  }
  getBatchList(queueId,projectId){
    const url = this.API_URL + '/getBatchList';
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    //this.isLoadingSubject.next(true);
    console.log("Inside get Batch list");
    return this.http.post(url, {
      "queueId" : queueId,
      "projectId": projectId
    },{
      headers: httpHeaders,
    });
  }
  getAllotedUserGroup(){
    const url = this.API_URL + '/getAllotedUserGroup';
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    //this.isLoadingSubject.next(true);
    console.log("Inside get Work Units");
    return this.http.post(url, {

    },{
      headers: httpHeaders,
    });
  }
  getWorkUnitStatusList(){
    const url = this.API_URL + '/getWorkUnitsStatusList';
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    //this.isLoadingSubject.next(true);
    console.log("Inside get Work Units Status List");
    return this.http.post(url, {

    },{
      headers: httpHeaders,
    });
  }
  getQueueForUser(user){
    /*const url = 'http://localhost:3000/queue' ;
    console.log(this.http.get(url));
    return this.http.get<string[]>(url);*/
    const url = this.API_URL + '/getQueueList';
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    //this.isLoadingSubject.next(true);
    console.log("Inside get Work Units");
    return this.http.post(url, {
      "queueId" : ""

    },{
      headers: httpHeaders,
    });
  }
  getStatusForQueue(queue){
    /*console.log("Queue",queue);
    const url = 'http://localhost:3000/status' ;
    return this.http.get<string[]>(url);*/
    const url = this.API_URL + '/getStatusList';
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    //this.isLoadingSubject.next(true);
    console.log("Inside get Status");
    return this.http.post(url, {
      "queueId": queue,

    },{
      headers: httpHeaders,
    });
  }
  getReaonsList(queue: any, status: string) {
    const url = this.API_URL + '/getReasonList';
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    //this.isLoadingSubject.next(true);
    console.log("Inside get Status");
    return this.http.post(url, {
        "queueId" : queue,
        "statusId" : status
    },{
      headers: httpHeaders,
    });
  }
  getRoadTypeList(projectId: string) {
    const url = this.API_URL + '/getRoadTypeList';
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    console.log("Inside get getRoadTypeList", projectId);
    return this.http.post(url, {
        "projectId" : projectId
    },{
      headers: httpHeaders,
    });
  }
  updateTask(updateTask: UpdateTaskModel) {
    const url = this.API_URL + '/updateTask';
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    console.log("Inside get updateTask");
    return this.http.post(url, updateTask,{
      headers: httpHeaders,
    });
  }
  reAllocateTask(reAllocateTask: UpdateTaskModel) {
    const url = this.API_URL + '/reAllocateTask';
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    console.log("Inside get reAllocateTask");
    return this.http.post(url, reAllocateTask,{
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
  updateWorkUnits(workUnitData: WorkUnitUpdateModel):Observable<any> {
    const url = this.API_URL + '/updateData';
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    console.log("Inside get updateData",workUnitData);
    return this.http.post(url, workUnitData,{
      headers: httpHeaders,
    });
  }
  getHoldReasonList(projectId: any) {
    const url = this.API_URL + '/getHoldReasonList';
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
        "projectId" : projectId
    },{
      headers: httpHeaders,
    });
  }
  getReceivedDateList(projectId: any) {
    const url = this.API_URL + '/getReceivedDateList';
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    //this.isLoadingSubject.next(true);
    console.log("Inside get Status");
    return this.http.post(url, {
        "projectId" : projectId
    },{
      headers: httpHeaders,
    });
  }
  getSubCountryList(projectId: any) {
    const url = this.API_URL + '/getSubCountryList';
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    //this.isLoadingSubject.next(true);
    console.log("Inside get Status");
    return this.http.post(url, {
        "projectId" : projectId
    },{
      headers: httpHeaders,
    });
  }
  getRoadTypeMapList(projectId: any) {
    const url = this.API_URL + '/getRoadTypeMapList';
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth.access_token}`,
    });
    //this.isLoadingSubject.next(true);
    console.log("Inside get Status");
    return this.http.post(url, {
        "projectId" : projectId
    },{
      headers: httpHeaders,
    });
  }
}
