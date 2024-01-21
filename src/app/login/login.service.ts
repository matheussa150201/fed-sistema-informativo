import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:8080/sistema-informativo/auth';

  constructor(private http: HttpClient, private authService: AuthService) {}

  login(authenticationData: any): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.post(url, authenticationData).pipe(
      tap((response: any) => {
        const token = response?.token; 
        if (token) {
          this.authService.setAccessToken(token);
        }
      })
    );
  }

  cadastrar(authenticationData: any): Observable<any> {
    const url = `${this.apiUrl}/register`;
    return this.http.post(url, authenticationData);
  }
}