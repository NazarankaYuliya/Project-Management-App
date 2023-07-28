import {
  Component,
  OnInit,
  EventEmitter,
  Inject,
  Optional,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Column, Task } from 'src/app/models/app.models';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-update-task-modal',
  templateUrl: './update-task-modal.component.html',
  styleUrls: ['./update-task-modal.component.scss'],
})
export class UpdateTaskModalComponent implements OnInit {
  boardId: string = '';
  columnId: string = '';
  taskId: string = '';
  taskTitle: string = '';
  taskDescription: string = '';
  taskForm: FormGroup<any> = new FormGroup({});

  @Output() taskUpdated: EventEmitter<Task> = new EventEmitter<Task>();

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private authService: AuthService,
    @Optional() private dialogRef: MatDialogRef<UpdateTaskModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    if (data) {
      this.boardId = data.boardId;
      this.columnId = data.columnId;
      this.taskId = data.taskId;
      this.taskTitle = data.taskTitle;
      this.taskDescription = data.taskDescription;
    }
  }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      title: [this.taskTitle, [Validators.required]],
      description: [this.taskDescription, [Validators.required]],
    });
  }

  updateTask(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const token = this.authService.getToken();

    let order: number = 0;

    if (token) {
      const TaskData: Task = {
        title: this.taskForm.value.title,
        order: order,
        description: this.taskForm.value.description,
        columnId: this.columnId,
        userId: 2,
        users: [],
      };

      this.backendService
        .updateTask(this.boardId, this.columnId, this.taskId, TaskData)
        .subscribe(
          (responce) => {
            this.taskUpdated.emit(responce);
            this.dialogRef.close();
          },
          (error) => {
            console.error(error);
          }
        );
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
