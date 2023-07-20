import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../models/app.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://final-task-backend.up.railway.app';

  constructor(private http: HttpClient, private router: Router) {}

  signup(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/signup`, user);
  }

  signin(user: User): Observable<User> {
    return this.http.post(`${this.baseUrl}/auth/signin`, user).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token as string);
        localStorage.setItem('login', user.login);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    this.router.navigate(['/welcome']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
}
