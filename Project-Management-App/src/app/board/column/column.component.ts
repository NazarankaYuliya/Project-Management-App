import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { AddTaskModalComponent } from 'src/app/modal/add-task-modal/add-task-modal.component';
import { UpdateColumnModalComponent } from 'src/app/modal/update-column-modal/update-column-modal.component';
import { Column, Task } from 'src/app/models/app.models';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnInit {
  @Input() column!: Column;
  @Input() boardId!: string | null;

  @Output() columnDeleted: EventEmitter<Column> = new EventEmitter<Column>();

  @Output() columnUpdated: EventEmitter<Column> = new EventEmitter<Column>();

  private isModalOpen = false;
  tasks: Task[] = [];
  test: Task[] = [
    { title: 'test', order: 0, description: 'test', userId: 'test', users: [] },
  ];

  constructor(
    private backendService: BackendService,
    private authService: AuthService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    if (this.boardId && this.column._id) {
      this.getTasksForColumn(this.boardId, this.column._id);
    }
  }

  getTasksForColumn(boardId: string, columnId: string) {
    this.backendService.getAllTasks(boardId, columnId).subscribe((tasks) => {
      this.tasks = tasks;
      this.tasks.sort((a, b) => a.order - b.order);
    });
  }

  deleteColumn() {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.confirmationModalOpen(
        'Are you sure you want to delete this column?'
      );

      dialogRef.afterClosed().subscribe((result) => {
        this.isModalOpen = false;

        if (result && this.boardId && this.column._id) {
          this.backendService
            .deleteColumn(this.boardId, this.column._id)
            .subscribe(() => {
              this.columnDeleted.emit(this.column);
            });
        }
      });
    }
  }

  updateColumn() {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.creationModalOpen(
        UpdateColumnModalComponent
      );

      dialogRef.afterClosed().subscribe((result) => {
        this.isModalOpen = false;

        if (result && result.submitted) {
          const updatedData: Column = {
            title: result.data.title,
            order: this.column.order,
          };
          if (this.boardId && this.column._id) {
            this.backendService
              .updateColumn(this.boardId, this.column._id, updatedData)
              .subscribe(
                (response) => {
                  this.columnUpdated.emit(response);
                  dialogRef.close();
                },
                (error) => {
                  console.error(error);
                }
              );
          }
        }
      });
    }
  }

  addTask(): void {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.creationModalOpen(
        AddTaskModalComponent
      );

      dialogRef.afterClosed().subscribe((result) => {
        this.isModalOpen = false;
        const userId = this.authService.getUserId();

        if (result && result.submitted && userId) {
          const taskData: Task = {
            title: result.data.title,
            order: this.tasks.length + 1,
            description: result.data.description,
            userId: userId,
            users: [],
          };

          if (this.boardId && this.column._id) {
            this.backendService
              .createTask(this.boardId, this.column._id, taskData)
              .subscribe(
                (response) => {
                  this.tasks.push(response);
                  dialogRef.close();
                },
                (error) => {
                  console.error(error);
                }
              );
          }
        }
      });
    }
  }

  handleTaskDeleted(task: Task) {
    const index = this.tasks.findIndex((c) => c._id === task._id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.tasks.forEach((task, i) => (task.order = i + 1));
    }
  }
  handleTaskUpdated(updatedTask: Task) {
    const existingTask = this.tasks.find((c) => c._id === updatedTask._id);
    if (existingTask) {
      existingTask.title = updatedTask.title;
      existingTask.description = updatedTask.description;
      existingTask.order = updatedTask.order;
    }
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      if (event.previousIndex === event.currentIndex) {
        return;
      }

      moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
      this.updateTaskOrder();
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const targetColumnId = this.column._id;

      console.log(targetColumnId);
    }
  }

  updateTaskOrder() {
    this.tasks.forEach((task, index) => {
      if (this.boardId && this.column._id && task._id) {
        this.backendService
          .updateTask(this.boardId, this.column._id, task._id, {
            title: task.title,
            order: index + 1,
            description: task.description,
            columnId: this.column._id,
            userId: this.authService.getUserId(),
            users: [],
          })
          .subscribe((response) => {
            this.handleTaskUpdated(response);
          });
      }
    });
  }
}
