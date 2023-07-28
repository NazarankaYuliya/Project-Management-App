import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AddTaskModalComponent } from 'src/app/modal/add-task-modal/add-task-modal.component';
import { UpdateTaskModalComponent } from 'src/app/modal/update-task-modal/update-task-modal.component';
import { Task } from 'src/app/models/app.models';
import { BackendService } from 'src/app/services/backend.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  @Input() boardId!: string | null;
  @Input() columnId!: string | null;
  tasks$!: Observable<Task[]>;
  private isModalOpen = false;

  constructor(
    private backendService: BackendService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    if (this.boardId && this.columnId) {
      this.tasks$ = this.backendService.getAllTasks(
        this.boardId,
        this.columnId
      );
    }
  }

  addTask() {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.creationModalOpen(
        AddTaskModalComponent,
        { boardId: this.boardId, columnId: this.columnId }
      );
      dialogRef.afterClosed().subscribe(() => {
        if (this.boardId && this.columnId) {
          this.tasks$ = this.backendService.getAllTasks(
            this.boardId,
            this.columnId
          );
        }

        this.isModalOpen = false;
      });
    }
  }

  updateTask(taskId: string, taskTitle: string, taskDescription: string) {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.creationModalOpen(
        UpdateTaskModalComponent,
        {
          boardId: this.boardId,
          columnId: this.columnId,
          taskId: taskId,
          taskTitle: taskTitle,
          taskDescription: taskDescription,
        }
      );
      dialogRef.afterClosed().subscribe(() => {
        if (this.boardId && this.columnId) {
          this.tasks$ = this.backendService.getAllTasks(
            this.boardId,
            this.columnId
          );
        }

        this.isModalOpen = false;
      });
    }
  }

  deleteTask(boardId: string, columnId: string, taskId: string) {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.confirmationModalOpen(
        'Are you sure you want to delete this task?'
      );

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.backendService
            .deleteTask(boardId, columnId, taskId)
            .subscribe(() => {
              this.tasks$ = this.backendService.getAllTasks(boardId, columnId);
            });
        }
        this.isModalOpen = false;
      });
    }
  }
}
