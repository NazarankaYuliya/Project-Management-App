import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, Observable, of, throwError } from 'rxjs';
import { Board, Column, Task, User } from '../models/app.models';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private baseUrl = 'https://final-task-backend.up.railway.app';
  private token: string | null;
  private login: string | null;

  boardId: BehaviorSubject<string> = new BehaviorSubject<string>('');

  boards: BehaviorSubject<Board[]> = new BehaviorSubject<Board[]>([]);
  columns: BehaviorSubject<Column[]> = new BehaviorSubject<Column[]>([]);
  tasks: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  boards$: Observable<Board[]> = this.boards.asObservable();
  boardId$: Observable<string> = this.boardId.asObservable();
  columns$: Observable<Column[]> = this.columns.asObservable();
  tasks$: Observable<any[]> = this.tasks.asObservable();

  constructor(private http: HttpClient) {
    this.token = this.getToken();
    this.login = this.getLogin();
  }

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

  deleteColumn(colunmsId: string, boadrId: string): Observable<any> {
    if (!this.token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders();
    return this.http
      .delete<any>(`${this.baseUrl}/boards/${boadrId}/columns/${colunmsId}`, {
        headers,
      })
      .pipe(
        tap(() => {
          const updatedColumns = this.columns
            .getValue()
            .filter((column) => column._id !== colunmsId);
          this.columns.next(updatedColumns);
          this.updateColumnsOrder();
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

  updateColumnsTitle(boardId: string, newTitle: string) {
    if (!this.token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders();
    return this.http.put<Column>(
      `${this.baseUrl}/boards/${boardId}/columns`,
      newTitle,
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

  getColumnsWithTask(boardId: string) {
    this.getAllColumns(boardId).subscribe((columns) => {
      columns.forEach((column) => {
        if (this.boardId && column._id) {
          this.getAllTasks(boardId, column._id).subscribe((tasks) => {
            column.tasks = tasks;
          });
        }
      });
    });
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
          const updatedColumns = this.columns
            .getValue()
            .map((column: Column) => {
              if (column.tasks && column._id === columnId) {
                column.tasks.push(createdTask);
              }
              return column;
            });

          this.columns.next(updatedColumns);
        })
      );
  }

  deleteTask(boadrId: string, columnId: string, taskId: string) {
    if (!this.token) {
      return throwError('Token not available');
    }

    const headers = this.getHeaders();
    return this.http
      .delete<any>(
        `${this.baseUrl}/boards/${boadrId}/columns/${columnId}/tasks/${taskId}`,
        {
          headers,
        }
      )
      .pipe(
        tap(() => {
          const updatedColumns = this.columns.getValue().map((column) => {
            if (column.tasks && column._id === columnId) {
              column.tasks = column.tasks.filter((task) => task._id !== taskId);
            }
            return column;
          });

          this.columns.next(updatedColumns);
        })
      );
  }
}
