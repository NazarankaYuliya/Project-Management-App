import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  //   constructor(private router: Router) {}
  //   canActivate(): boolean {
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       return true;
  //     } else {
  //       //   this.router.navigate(['/main-route']);
  //       return false;
  //     }
  //   }
}
