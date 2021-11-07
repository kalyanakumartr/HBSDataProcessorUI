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
import { Brand } from '../_models/brand.model';
import { Asset } from '../_models/asset.model';


@Injectable({
  providedIn: 'root'
})
export class UsersService extends TableService<UserModel> implements OnDestroy {

    // public fields
    isLoadingSubject: BehaviorSubject<boolean>;
    private _errorMsg = new BehaviorSubject<string>('');

  API_URL = `${environment.adminApiUrl}`;
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
  fetchHR(id:string){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }


    console.log("Inside fetch HR");
    const url = this.API_URL + '/getHRRecord';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<UserHRModel>(url, {"formUser": { "id": id }},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  getItemById(id: string): Observable<UserModel> {

    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    return this.authHttpService.getUserByToken(auth.access_token, id).pipe(
      map((user: UserModel) => {

        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  fetchIT(id:string){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }


    console.log("Inside fetch IT");
    const url = this.API_URL + '/getITRecord';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<UserITModel>(url, {"formUser": { "id": id }},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  saveHR(hrRecord,formUser){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside Save HR");
    const url = this.API_URL + '/updateHRRecord';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {"formUser":formUser,"formHRRecord":hrRecord},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  saveIT(itRecord,formUser){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside Save IT");
    const url = this.API_URL + '/updateITRecord';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {"formUser":formUser,"formITRecord":itRecord},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('Error in Saving IT Records', err);
        return of("Error in Saving IT Records");
      })
    );
  }
  changePassword(userId,password){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside Save Password");
    const url = this.API_URL + '/updatePassword';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {"formAction":"ChangePassword","media":"Manual","userId":userId, "newPassword":password},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('Error in Saving Password', err);
        return of("Error in Saving Password");
      })
    );
  }
  saveOPR(oprRecord,formUser){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside Save OPR");
    const url = this.API_URL + '/updateOperationalRecord';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {"formUser":formUser,"formOperationalRecord":oprRecord},{headers: httpHeaders}).pipe(
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
  getUserAssets(id){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }


    console.log("Inside IT User Assets");
    const url = this.API_URL + '/getUserAssets';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<UserITModel>(url, {"formUser": { "id": id }},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  getAssetList(){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }


    console.log("Inside Assets");
    const url = this.API_URL + '/getAssetsList';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<Asset>(url,{},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  getBrandList(){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }


    console.log("Inside Brand");
    const url = this.API_URL + '/getAssetsBrandList';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<Brand>(url,{},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  createUserAssets(itItems,formUser){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside Save IT");
    const url = this.API_URL + '/createUserAssets';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {"formUser":formUser,"usersITAsset":itItems},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
  updateUserAssets(itItems,formUser){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside Save IT");
    const url = this.API_URL + '/updateUserAssets';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {"formUser":formUser,"usersITAsset":itItems},{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }
}
