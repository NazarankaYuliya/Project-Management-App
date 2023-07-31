import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Board, Column, Task } from '../models/app.models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private baseUrl = 'https://final-task-backend-production-c754.up.railway.app';

  private token: string | null = null;
  private login: string | null = null;

  boards: BehaviorSubject<Board[]> = new BehaviorSubject<Board[]>([]);

  boards$: Observable<Board[]> = this.boards.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.token = this.authService.getToken();
    this.login = this.authService.getLogin();
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      if (loggedIn) {
        this.token = this.authService.getToken();
        this.login = this.authService.getLogin();
      }
    });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
  }

  getAllBoards(): Observable<Board[]> {
    if (!this.token || !this.login) {
      return throwError('Token or login not available');
    }

    const headers = this.getHeaders();
    return this.http.get<Board[]>(`${this.baseUrl}/boards`, { headers }).pipe(
      tap((boards: Board[]) => {
        const usersBoards = boards.filter(
          (board) => board.owner === this.login
        );
        this.boards.next(usersBoards);
      })
    );
  }

  getBoardById(boardId: string) {
    if (!this.token) {
      return throwError('Token or login not available');
    }
    const headers = this.getHeaders();
    return this.http.get<Board>(`${this.baseUrl}/boards/${boardId}`, {
      headers,
    });
  }

  createBoard(newBoard: Board): Observable<Board> {
    if (!this.token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders();
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
    if (!this.token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders();
    return this.http.delete<any>(`${this.baseUrl}/boards/${boardId}`, {
      headers,
    });
  }

  getAllColumns(boardId: string): Observable<Column[]> {
    if (!this.token) {
      return throwError('Token or login not available');
    }

    const headers = this.getHeaders();
    return this.http.get<Column[]>(
      `${this.baseUrl}/boards/${boardId}/columns`,
      {
        headers,
      }
    );
  }

  createColumn(boardId: string, newColumn: Column): Observable<Column> {
    if (!this.token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders();
    return this.http.post<Column>(
      `${this.baseUrl}/boards/${boardId}/columns`,
      newColumn,
      {
        headers,
      }
    );
  }

  deleteColumn(boadrId: string, columnId: string): Observable<void> {
    if (!this.token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders();
    return this.http.delete<void>(
      `${this.baseUrl}/boards/${boadrId}/columns/${columnId}`,
      {
        headers,
      }
    );
  }

  updateColumn(
    boardId: string,
    columnId: string,
    updateData: any
  ): Observable<Column> {
    if (!this.token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders();
    return this.http.put<Column>(
      `${this.baseUrl}/boards/${boardId}/columns/${columnId}`,
      updateData,
      {
        headers,
      }
    );
  }

  getAllTasks(boardId: string, columnsId: string): Observable<Task[]> {
    if (!this.token) {
      return throwError('Token or login not available');
    }

    const headers = this.getHeaders();
    return this.http.get<Task[]>(
      `${this.baseUrl}/boards/${boardId}/columns/${columnsId}/tasks`,
      {
        headers,
      }
    );
  }

  createTask(
    boardId: string,
    columnId: string,
    newTask: Task
  ): Observable<Task> {
    if (!this.token) {
      return throwError('Token or login not available');
    }
    const headers = this.getHeaders();
    return this.http.post<Task>(
      `${this.baseUrl}/boards/${boardId}/columns/${columnId}/tasks`,
      newTask,
      {
        headers,
      }
    );
  }

  updateTask(
    boardId: string,
    columnId: string,
    taskId: string,
    updatedTask: any
  ): Observable<any> {
    if (!this.token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders();

    return this.http.put<any>(
      `${this.baseUrl}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
      updatedTask,
      { headers }
    );
  }

  deleteTask(
    boadrId: string,
    columnId: string,
    taskId: string
  ): Observable<void> {
    if (!this.token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders();
    return this.http.delete<void>(
      `${this.baseUrl}/boards/${boadrId}/columns/${columnId}/tasks/${taskId}`,
      {
        headers,
      }
    );
  }
}
