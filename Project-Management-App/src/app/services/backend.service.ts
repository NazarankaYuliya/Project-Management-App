import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Board, Column, User } from '../models/app.models';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private baseUrl = 'https://final-task-backend.up.railway.app';

  boardId: BehaviorSubject<string> = new BehaviorSubject<string>('');

  boards: BehaviorSubject<Board[]> = new BehaviorSubject<Board[]>([]);
  columns: BehaviorSubject<Column[]> = new BehaviorSubject<Column[]>([]);

  boards$: Observable<Board[]> = this.boards.asObservable();
  columns$: Observable<Column[]> = this.columns.asObservable();

  constructor(private http: HttpClient) {}

  setBoardId(boardId: string) {
    this.boardId.next(boardId);
  }

  getBoardId(): Observable<string> {
    return this.boardId.asObservable();
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getLogin(): string | null {
    return localStorage.getItem('login');
  }

  // private updateBoards(boards: Board[]): void {
  //   this.boards.next(boards);
  // }

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
      tap((boards: Board[]) => {
        this.boards.next(boards);
      })
    );
  }

  getBoardById(boardId: string) {
    const token = this.getToken();
    if (!token) {
      return throwError('Token or login not available');
    }
    const headers = this.getHeaders(token);
    return this.http.get<Board>(`${this.baseUrl}/boards/${boardId}`, {
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

  getAllColumns(boardId: string): Observable<Column[]> {
    const token = this.getToken();

    if (!token) {
      return throwError('Token or login not available');
    }

    const headers = this.getHeaders(token);
    return this.http
      .get<Column[]>(`${this.baseUrl}/boards/${boardId}/columns`, {
        headers,
      })
      .pipe(
        tap((columns: Column[]) => {
          this.columns.next(columns);
          this.updateColumnsOrder();
        })
      );
  }

  createColumn(boardId: string, newColumn: Column): Observable<Column> {
    const token = this.getToken();
    if (!token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders(token);
    return this.http
      .post<Column>(`${this.baseUrl}/boards/${boardId}/columns`, newColumn, {
        headers,
      })
      .pipe(
        tap((createdColumn: Column) => {
          const currentColumn = this.columns.getValue();

          currentColumn.push(createdColumn);

          this.columns.next(currentColumn);
        })
      );
  }

  deleteColumn(colunmsId: string, boadrId: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders(token);
    return this.http.delete<any>(
      `${this.baseUrl}/boards/${boadrId}/columns/${colunmsId}`,
      {
        headers,
      }
    );
  }
  updateColumnsOrder(): void {
    const currentColumns = this.columns.getValue();

    currentColumns.forEach((column, index) => {
      column.order = index + 1;
    });
    this.columns.next(currentColumns);
  }

  updateColumnsTitle(boardId: string, newTitle: string) {
    const token = this.getToken();
    if (!token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders(token);
    return this.http.put<Column>(
      `${this.baseUrl}/boards/${boardId}/columns`,
      newTitle,
      {
        headers,
      }
    );
  }
}
