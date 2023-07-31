import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-task-modal',
  templateUrl: './update-task-modal.component.html',
  styleUrls: ['./update-task-modal.component.scss'],
})
export class UpdateTaskModalComponent implements OnInit {
  taskForm: FormGroup<any> = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<UpdateTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      title: [this.data.title, [Validators.required]],
      description: [this.data.description, [Validators.required]],
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
