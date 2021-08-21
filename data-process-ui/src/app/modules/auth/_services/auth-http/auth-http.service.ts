import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../_models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../_models/auth.model';
import { ObjectModel } from '../../_models/object.model';
import { TableResponseModel } from 'src/app/_metronic/shared/crud-table';

const API_USERS_URL = `${environment.apiUrl}`;
const API_ADMIN_URL = `${environment.adminApiUrl}`;
const API_USERS_Json_URL = `${environment.apiJsonUrl}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {

    let body = `username=${username}&password=${password}&grant_type=password`;

    return this.http.post<AuthModel>(API_USERS_URL + '/core-oauth/oauth/token',
    body,
    { headers:{
               'Access-Control-Allow-Credentials': 'true',
               'Content-Type':'application/x-www-form-urlencoded',
               'Authorization': 'Basic RURSQVBQTElDQVRJT046S2FsYW1AMTUxMDMx',
               'Username': 'EDRAPPLICATION','Password': 'Kalam@151031'
              },
              withCredentials: true
    });
   //return this.http.get<AuthModel>(API_USERS_URL + 'core-oauth/oauth/token');
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, {
      email,
    });
  }

  getUserByToken(token,loginId): Observable<UserModel> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    console.log("LoginId",loginId);
    return this.http.post<UserModel>(`${API_ADMIN_URL}/getUser`, {
      "searchParam": loginId+""
    },{
      headers: httpHeaders,
    });
  }
  getUserList(token) {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    console.log("url",`${API_ADMIN_URL}/searchUser`);
    console.log("token", token);
    return this.http.post(`${API_ADMIN_URL}/searchUser`, {
      "searchTerm": "ananth.malbal@gmail.com"
    },{
      headers: httpHeaders,
    });
  }
}
