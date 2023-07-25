import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { AddColumnModalComponent } from '../modal/add-column-modal/add-column-modal.component';
import { AddTaskModalComponent } from '../modal/add-task-modal/add-task-modal.component';
import { Board, Column, Task } from '../models/app.models';
import { BackendService } from '../services/backend.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  public boardId: string | null = null;
  public boardTitle: string | null = null;
  public columns$!: Observable<Column[]>;
  public columnsId: string | null = null;
  public tasks$!: Observable<Task[]>;
  private isModalOpen = false;

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.boardId = params.get('id');
      if (this.boardId) {
        this.backendService.setBoardId(this.boardId);

        this.backendService.getColumnsWithTask(this.boardId);
        this.columns$ = this.backendService.columns;
      }
    });
  }

  addColumn() {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.creationModalOpen(
        AddColumnModalComponent
      );
      dialogRef.afterClosed().subscribe(() => {
        this.isModalOpen = false;
      });
    }
  }

  updateColumnsTitle() {}

  deleteColumn(columnsId: string, boadrId: string) {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.confirmationModalOpen(
        'Are you sure you want to delete this column?'
      );

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.backendService.deleteColumn(columnsId, boadrId).subscribe();
        }
        this.isModalOpen = false;
      });
    }
  }

  addTask(columnId: string, boardId: string) {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.creationModalOpen(
        AddTaskModalComponent,
        { boardId: boardId, columnId: columnId }
      );
      dialogRef.afterClosed().subscribe(() => {
        this.isModalOpen = false;
      });
    }
  }

  deleteTask(boadrId: string, columnId: string, taskId: string) {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.confirmationModalOpen(
        'Are you sure you want to delete this task?'
      );

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.backendService.deleteTask(boadrId, columnId, taskId).subscribe();
        }
        this.isModalOpen = false;
      });
    }
  }
}
