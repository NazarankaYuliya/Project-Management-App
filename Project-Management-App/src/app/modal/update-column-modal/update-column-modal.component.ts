import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-column-modal',
  templateUrl: './update-column-modal.component.html',
  styleUrls: ['./update-column-modal.component.scss'],
})
export class UpdateColumnModalComponent implements OnInit {
  columnForm: FormGroup<any> = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,

    @Optional() private dialogRef: MatDialogRef<UpdateColumnModalComponent>
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
