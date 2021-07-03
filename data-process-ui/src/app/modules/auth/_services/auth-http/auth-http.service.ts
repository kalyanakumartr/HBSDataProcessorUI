import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../_models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../_models/auth.model';

const API_USERS_URL = `${environment.apiUrl}`;
const API_USERS_Json_URL = `${environment.apiJsonUrl}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  // public methods
  login(username: string, password: string): Observable<any> {
    let body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);
    body.set('grant_type', 'password');
    let headers = new HttpHeaders();
    headers.set('Authorization', 'Basic SEJTQVBQTElDQVRJT046S2FsYW1AMTUxMDMx');
    headers.set('Username', 'EDRAPPLICATION');
    headers.set('Password', 'Kalam@151031');

    console.log(API_USERS_URL + 'core-oauth/oauth/token', body)
    //return this.http.post<AuthModel>(API_USERS_URL + 'core-oauth/oauth/token', body, { headers, withCredentials: true });
   return this.http.get<AuthModel>(API_USERS_URL + 'core-oauth/oauth/token');
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

  getUserByToken(token): Observable<UserModel> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserModel>(`${API_USERS_Json_URL}user`, {
      headers: httpHeaders,
    });
  }
}
