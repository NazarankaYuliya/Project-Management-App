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
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss'],
})
export class AddTaskModalComponent implements OnInit {
  boardId: string = '';
  columnId: string = '';
  taskForm: FormGroup<any> = new FormGroup({});

  @Output() taskCreated: EventEmitter<Task> = new EventEmitter<Task>();

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    @Optional() private dialogRef: MatDialogRef<AddTaskModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    if (data) {
      this.columnId = data.columnId;
    }
  }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  createTask(): void {
    if (this.taskForm.invalid) {
      return;
    }

    this.backendService.getBoardId().subscribe((response) => {
      this.boardId = response;
    });

    const token = localStorage.getItem('token');

    let order: number = 0;

    if (token) {
      this.backendService.columns$.subscribe((columns: Column[]) => {
        let currentColumnWithTasks = columns.filter(
          (column) => column._id === this.columnId
        )[0];
        currentColumnWithTasks.tasks?.forEach((task: Task, index: number) => {
          order = index + 1;
        });
      });

      const TaskData: Task = {
        title: this.taskForm.value.title,
        order: order,
        description: this.taskForm.value.description,
        userId: 2,
        users: [],
      };

      this.backendService
        .createTask(this.boardId, this.columnId, TaskData)
        .subscribe(
          (responce) => {
            this.taskCreated.emit(responce);
            this.dialogRef.close();
          },
          (error) => {
            console.error(error);
          }
        );
    }
  }

  getCurrentColumnWithTasks() {}

  closeModal(): void {
    this.dialogRef.close();
  }
}
