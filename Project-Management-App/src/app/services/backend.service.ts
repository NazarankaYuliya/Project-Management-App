import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Board, User, UserResponse } from '../models/app.models';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private baseUrl = 'https://final-task-backend.up.railway.app';

  constructor(private http: HttpClient) {}

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  signup(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/signup`, user);
  }

  signin(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/signin`, user).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token as string);
        localStorage.setItem('login', user.login);
      })
    );
  }

  getUserList(token: string): Observable<any> {
    const headers = this.getHeaders(token);
    return this.http.get(`${this.baseUrl}/users`, { headers });
  }

  getBoardList(token: string): Observable<any> {
    const headers = this.getHeaders(token);
    return this.http.get(`${this.baseUrl}/boards/`, { headers });
  }

  createBoard(board: Board, token: string): Observable<any> {
    const headers = this.getHeaders(token);
    return this.http.post<any>(`${this.baseUrl}/boards`, board, { headers });
  }
}
