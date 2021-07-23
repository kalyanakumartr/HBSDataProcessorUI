import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { UserModel } from '../_models/user.model';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http';


@Injectable({
  providedIn: 'root'
})
export class UsersService extends TableService<UserModel> implements OnDestroy {
    private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
    // public fields
    isLoadingSubject: BehaviorSubject<boolean>;

  API_URL = `${environment.apiUrl}/customers`;
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
  private getAuthFromLocalStorage(): AuthModel {
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
}
