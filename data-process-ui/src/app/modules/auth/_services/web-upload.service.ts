import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http';
import { RoleModel } from '../_models/role.model';
import { Department } from '../_models/department.model';
import { Project } from '../_models/project.model';
import { Team } from '../_models/team.model';
import { UploadedFiles } from '../../web-upload/modal/upload-files.model';


@Injectable({
  providedIn: 'root'
})
export class WebUploadService  extends TableService<UploadedFiles> implements OnDestroy {
    // public fields
    isLoadingSubject: BehaviorSubject<boolean>;
    private _errorMsg = new BehaviorSubject<string>('');
    protected http: HttpClient;
  API_URL = `${environment.edrReaderApi}`;
  constructor(@Inject(HttpClient) http, private authHttpService: AuthHTTPService,) {
    super(http);
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  uploadFile(projectId,file){
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    console.log("Inside Web Upload");
    const url = this.API_URL + '/webUpload/Excel';
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    let formData: FormData = new FormData();
    formData.append('projectId', projectId);
    formData.append('files[]', file);
    return this.http.post(url, formData,{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMsg.next(err);
        console.error('Error in Web Upload', err);
        return of("Error in Web Upload");
      })
    );
  }

}
