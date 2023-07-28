import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LoginResponce, UserResponse, User } from '../models/app.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://final-task-backend.up.railway.app';

  private token: string | null = null;
  private login: string | null = null;
  private userId: null | string = null;

  constructor(private http: HttpClient, private router: Router) {}

  signup(user: User): Observable<UserResponse> {
    return this.http
      .post<UserResponse>(`${this.baseUrl}/auth/signup`, user)
      .pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  signin(user: User): Observable<LoginResponce> {
    return this.http
      .post<LoginResponce>(`${this.baseUrl}/auth/signin`, user)
      .pipe(
        catchError((error) => {
          return this.handleError(error);
        }),
        tap(({ token }) => {
          this.setToken(token);
          this.setLogin(user.login);
          localStorage.setItem('token', token);
          localStorage.setItem('login', user.login);

          this.getUsers().subscribe();
        })
      );
  }

  setToken(token: string | null) {
    this.token = token;
  }

  setLogin(login: string | null) {
    this.login = login;
  }

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getLogin() {
    return localStorage.getItem('login');
  }

  getUserId() {
    return localStorage.getItem('userId');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;

    const expirationDate = this.getTokenExpirationDate(token);
    if (!expirationDate) return true;

    return expirationDate <= new Date();
  }

  logout(): void {
    this.setToken(null);
    this.setLogin(null);
    localStorage.clear();

    this.router.navigate(['/welcome']);
  }

  getTokenExpirationDate(token: string): Date | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload && payload.exp) {
        return new Date(payload.exp * 1000);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred. Please try again later.';

    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else {
      if (error.status === 401) {
        errorMessage = 'Invalid login or password. Please try again.';
      } else if (error.status === 404) {
        errorMessage = 'Account not found.';
      } else if (error.status === 403) {
        errorMessage = 'Account disabled.';
      }
    }

    return throwError(errorMessage);
  }

  getUsers() {
    const headers = new HttpHeaders({
      accept: 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get<any[]>(`${this.baseUrl}/users`, { headers }).pipe(
      tap((users) => {
        users.forEach((user) => {
          if (user.login === this.login) {
            this.setUserId(user._id);
            localStorage.setItem('userId', user._id);
          }
        });
      })
    );
  }

  updateUser(user: User) {
    const headers = new HttpHeaders({
      accept: 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    return this.http
      .put(`${this.baseUrl}/users/${this.userId}`, user, { headers })
      .subscribe();
  }
}
