import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'access_token';

  token: string | null = localStorage.getItem('access_token');

  constructor(){

  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUserName(): string | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub || decodedToken.username || null;
      // Ajuste conforme necessário se o campo do nome de usuário for diferente
    } catch (error) {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();

    if (!token) {
      return true;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const dataExpiracao = new Date(decodedToken.exp * 1000);
      return dataExpiracao < new Date();
    } catch (error) {
      return true;
    }
  }
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