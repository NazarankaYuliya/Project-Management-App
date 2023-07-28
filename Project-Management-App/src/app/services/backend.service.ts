import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, Observable, of, throwError } from 'rxjs';
import { Board, Column, Task, User } from '../models/app.models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private baseUrl = 'https://final-task-backend.up.railway.app';

  private token: string | null = null;
  private login: string | null = null;

  boardId: BehaviorSubject<string> = new BehaviorSubject<string>('');

  boards: BehaviorSubject<Board[]> = new BehaviorSubject<Board[]>([]);
  columns: BehaviorSubject<Column[]> = new BehaviorSubject<Column[]>([]);
  tasks: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  boards$: Observable<Board[]> = this.boards.asObservable();
  boardId$: Observable<string> = this.boardId.asObservable();
  columns$: Observable<Column[]> = this.columns.asObservable();
  tasks$: Observable<any[]> = this.tasks.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.token = this.authService.getToken();
    this.login = this.authService.getLogin();
  }

  setBoardId(boardId: string) {
    this.boardId.next(boardId);
  }

  getBoardId(): Observable<string> {
    return this.boardId.asObservable();
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
        this.boards.next(boards);
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
    if (!this.token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders();
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

  deleteColumn(columnId: string, boadrId: string): Observable<any> {
    if (!this.token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders();
    return this.http
      .delete<any>(`${this.baseUrl}/boards/${boadrId}/columns/${columnId}`, {
        headers,
      })
      .pipe(
        tap(() => {
          const currentColumns = this.columns.getValue();
          const updatedColumns = currentColumns.filter(
            (column) => column._id !== columnId
          );
          this.columns.next(updatedColumns);
        })
      );
  }

  updateColumnsOrder(): void {
    const currentColumns = this.columns.getValue();

    currentColumns.forEach((column, index) => {
      column.order = index + 1;
    });
    this.columns.next(currentColumns);
  }

  updateColumn(boardId: string, columnId: string, updateData: any) {
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

  getAllTasks(boardId: string, columnsId: string): Observable<any[]> {
    if (!this.token) {
      return throwError('Token or login not available');
    }

    const headers = this.getHeaders();
    return this.http
      .get<any[]>(
        `${this.baseUrl}/boards/${boardId}/columns/${columnsId}/tasks`,
        {
          headers,
        }
      )
      .pipe(
        tap((tasks: Task[]) => {
          this.tasks.next(tasks);
        })
      );
  }

  createTask(boardId: string, columnId: string, newTask: any): Observable<any> {
    if (!this.token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders();

    return this.http
      .post<any>(
        `${this.baseUrl}/boards/${boardId}/columns/${columnId}/tasks`,
        newTask,
        { headers }
      )
      .pipe(
        tap((createdTask: Task) => {
          const currentTasks = this.tasks.getValue();

          const updatedTasks = [...currentTasks, createdTask];
          this.tasks.next(updatedTasks);
        })
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

  deleteTask(boadrId: string, columnId: string, taskId: string) {
    if (!this.token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders();
    return this.http.delete<any>(
      `${this.baseUrl}/boards/${boadrId}/columns/${columnId}/tasks/${taskId}`,
      {
        headers,
      }
    );
  }
}
