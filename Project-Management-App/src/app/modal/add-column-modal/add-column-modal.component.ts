import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-column-modal',
  templateUrl: './add-column-modal.component.html',
  styleUrls: ['./add-column-modal.component.scss'],
})
export class AddColumnModalComponent implements OnInit {
  columnForm: FormGroup<any> = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<AddColumnModalComponent>
  ) {}

  ngOnInit(): void {
    this.columnForm = this.formBuilder.group({
      title: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.columnForm.invalid) {
      return;
    }
    this.dialogRef.close({ submitted: true, data: this.columnForm.value });
  }

  onClose(): void {
    this.dialogRef.close({ submitted: false });
  }
}
