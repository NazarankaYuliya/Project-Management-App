import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss'],
})
export class AddTaskModalComponent implements OnInit {
  taskForm: FormGroup<any> = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<AddTaskModalComponent>
  ) {}

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }
    this.dialogRef.close({ submitted: true, data: this.taskForm.value });
  }

  onClose(): void {
    this.dialogRef.close({ submitted: false });
  }
}
