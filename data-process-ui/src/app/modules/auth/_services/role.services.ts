import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http';
import { RoleModel } from '../_models/role.model';


@Injectable({
  providedIn: 'root'
})
export class RoleService extends TableService<RoleModel> implements OnDestroy {

    // public fields
    isLoadingSubject: BehaviorSubject<boolean>;

  API_URL = `${environment.adminApiUrl}`;
  constructor(@Inject(HttpClient) http, private authHttpService: AuthHTTPService,) {
    super(http);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  getActiveRoleList(division){

    const url = this.API_URL + "/getActiveRoleList";
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post(url, {"searchTerm":""},{headers: httpHeaders}).pipe(
      catchError(err => {

        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }

}
