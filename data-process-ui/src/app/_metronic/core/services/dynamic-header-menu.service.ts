import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthModel } from 'src/app/modules/auth/_models/auth.model';
import { environment } from 'src/environments/environment';
import { DynamicHeaderMenuConfig } from '../../configs/dynamic-header-menu.config';

const emptyMenuConfig = {
  items: []
};
const API_VIEW_URL = `${environment.viewApiUrl}`;


@Injectable({
  providedIn: 'root'
})
export class DynamicHeaderMenuService {
  private menuConfigSubject = new BehaviorSubject<any>(emptyMenuConfig);
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  menuConfig$: Observable<any>;
  constructor(private http: HttpClient) {
    this.menuConfig$ = this.menuConfigSubject.asObservable();
    this.loadMenu();
  }

  // Here you able to load your menu from server/data-base/localeStorage
  // Default => from DynamicHeaderMenuConfig
  private loadMenu() {
    var access_token =this.getAuthFromLocalStorage().access_token;
    console.log("Load Menu");
   // this.setMenu(this.getMenuFromUrl(access_token));
   this.setMenu(DynamicHeaderMenuConfig);
  }

  private setMenu(menuConfig) {
    this.menuConfigSubject.next(menuConfig);
  }

  private getMenu(): any {
    return this.menuConfigSubject.value;
  }

  getMenuFromUrl(token) {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    console.log("token",token);
    return this.http.post(`${API_VIEW_URL}/getHeaderMenu`,{
      headers: httpHeaders,
    });
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
