import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'access_token';

  getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setAccessToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  removeAccessToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}