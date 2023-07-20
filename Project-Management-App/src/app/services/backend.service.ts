import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Board, User } from '../models/app.models';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private baseUrl = 'https://final-task-backend.up.railway.app';

  boards: BehaviorSubject<Board[]> = new BehaviorSubject<Board[]>([]);

  boards$: Observable<Board[]> = this.boards.asObservable();

  constructor(private http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getLogin(): string | null {
    return localStorage.getItem('login');
  }

  private updateBoards(boards: Board[]): void {
    this.boards.next(boards);
  }

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getAllBoards(): Observable<Board[]> {
    const token = this.getToken();
    const login = this.getLogin();

    if (!token || !login) {
      return throwError('Token or login not available');
    }

    const headers = this.getHeaders(token);
    return this.http.get<Board[]>(`${this.baseUrl}/boards`, { headers }).pipe(
      map((boards: Board[]) => boards.filter((board) => board.owner === login)),
      tap((filteredBoards: Board[]) => {
        this.updateBoards(filteredBoards);
      })
    );
  }

  deleteBoard(boardId: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders(token);
    return this.http.delete<any>(`${this.baseUrl}/boards/${boardId}`, {
      headers,
    });
  }

  createBoard(newBoard: Board): Observable<Board> {
    const token = this.getToken();
    if (!token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders(token);
    return this.http
      .post<Board>(`${this.baseUrl}/boards`, newBoard, { headers })
      .pipe(
        tap((createdBoard: Board) => {
          const currentBoards = this.boards.getValue();

          currentBoards.push(createdBoard);

          this.boards.next(currentBoards);
        })
      );
  }

  //deleteBoard(boardId) {}

  // getUserList(token: string): Observable<any> {
  //   const headers = this.getHeaders(token);
  //   return this.http.get(`${this.baseUrl}/users`, { headers });
  // }

  // getBoardList(token: string): Observable<any> {
  //   const headers = this.getHeaders(token);
  //   return this.http.get(`${this.baseUrl}/boards/`, { headers });
  // }

  // createBoard(board: Board, token: string): Observable<any> {
  //   const headers = this.getHeaders(token);
  //   return this.http.post<any>(`${this.baseUrl}/boards`, board, { headers });
  // }
}
