import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  static username = "developer@confidosoft.com";
  static password = "Test@123";
  constructor(private http: HttpClient) {
    this.token = '';
   }

  login(username: string, password: string) {
    return this.http.post('https://diasmokeapi.confidosoftsolutions.com/api/v1/Auth/login', { username, password }).pipe(
      tap((response: any) => {
        this.token = response.token;
      })
    );


    }
}
