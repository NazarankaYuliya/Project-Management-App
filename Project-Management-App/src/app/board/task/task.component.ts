import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UpdateTaskModalComponent } from 'src/app/modal/update-task-modal/update-task-modal.component';
import { Task } from 'src/app/models/app.models';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  @Input() task!: Task;
  @Input() boardId!: string | null;
  @Input() columnId!: string | null;

  private isModalOpen = false;

  @Output() taskDeleted: EventEmitter<Task> = new EventEmitter<Task>();

  @Output() taskUpdated: EventEmitter<Task> = new EventEmitter<Task>();

  constructor(
    private backendService: BackendService,
    private authService: AuthService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {}

  deleteTask() {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.confirmationModalOpen(
        'Are you sure you want to delete this task?'
      );

      dialogRef.afterClosed().subscribe((result) => {
        this.isModalOpen = false;
        if (result && this.boardId && this.columnId && this.task._id) {
          this.backendService
            .deleteTask(this.boardId, this.columnId, this.task._id)
            .subscribe(() => {
              this.taskDeleted.emit(this.task);
            });
        }
      });
    }
  }

  updateTask() {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.creationModalOpen(
        UpdateTaskModalComponent
      );

      dialogRef.afterClosed().subscribe((result) => {
        this.isModalOpen = false;

        if (result && result.submitted && this.columnId) {
          const updatedTask: Task = {
            title: result.data.title,
            order: this.task.order,
            description: result.data.description,
            columnId: this.task.columnId,
            userId: this.task.userId,
            users: this.task.users,
          };
          if (this.boardId && this.task._id) {
            this.backendService
              .updateTask(
                this.boardId,
                this.columnId,
                this.task._id,
                updatedTask
              )
              .subscribe(
                (response) => {
                  this.taskUpdated.emit(response);
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
}
