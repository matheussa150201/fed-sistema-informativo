import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../login/auth.service';


@Injectable({
  providedIn: 'root'
})
export class GuardRotaGuard implements CanActivate {


  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('Verificando Token expirado. ');
    if (this.authService.isTokenExpired()) {
      console.log('Token expirado. Redirecionando para a página de login.');
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
