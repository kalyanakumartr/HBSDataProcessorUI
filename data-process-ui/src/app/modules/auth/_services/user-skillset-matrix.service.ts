import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthHTTPService } from './auth-http';
import { UserSkillSetMatrixModel } from '../_models/user-skillset-matrix.model';


@Injectable({
  providedIn: 'root'
})
export class UserSkillSetMatrixService extends TableService<UserSkillSetMatrixModel> implements OnDestroy {

    // public fields
    isLoadingSubject: BehaviorSubject<boolean>;

  API_URL = `${environment.adminApiUrl}`;
  constructor(@Inject(HttpClient) http, private authHttpService: AuthHTTPService,) {
    super(http);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  getSkillSetMatrixList(){
    const url = this.API_URL + "/getSkillSetMatrixList";
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
