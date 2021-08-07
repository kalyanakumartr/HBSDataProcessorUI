import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthModel } from 'src/app/modules/auth/_models/auth.model';
import { environment } from 'src/environments/environment';
import { DynamicAsideMenuConfig } from '../../configs/dynamic-aside-menu.config';

const emptyMenuConfig = {
  items: []
};
const API_VIEW_URL = `${environment.viewApiUrl}`;
@Injectable({
  providedIn: 'root'
})
export class DynamicAsideMenuService {
  private menuConfigSubject = new BehaviorSubject<any>(emptyMenuConfig);
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  menuConfig$: Observable<any>;
  constructor(private http: HttpClient) {
    this.menuConfig$ = this.menuConfigSubject.asObservable();
    this.loadMenu();
  }


  // Here you able to load your menu from server/data-base/localStorage
  // Default => from DynamicAsideMenuConfig
  private loadMenu() {
    //this.setMenu(DynamicAsideMenuConfig);
    var access_token =this.getAuthFromLocalStorage().access_token;
    console.log("Load Menu");
    this.getMenuFromUrl(access_token)
    .pipe(
      tap((res: any) => {
        console.log("RES",res);
        this.setMenu(res);
      })).subscribe();
    console.log("Menu", this.getMenu());
   //this.setMenu(DynamicHeaderMenuConfig);
   console.log("Menu1", this.getMenu());
  }

  private setMenu(menuConfig) {
    this.menuConfigSubject.next(menuConfig);
  }

  private getMenu(): any {
    return this.menuConfigSubject.value;
  }
  getMenuFromUrl(token) : Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    console.log("tokenssssss",token);
    console.log("ssssAAAAAA",`${API_VIEW_URL}`);


      return this.http.post(`${API_VIEW_URL}/getHeaderMenu`,{},{
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
