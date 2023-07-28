import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Board } from 'src/app/models/app.models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-board-modal',
  templateUrl: './add-board-modal.component.html',
  styleUrls: ['./add-board-modal.component.scss'],
})
export class AddBoardModalComponent implements OnInit {
  boardForm: FormGroup<any> = new FormGroup({});
  owner!: string | null;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<AddBoardModalComponent>
  ) {}

  ngOnInit(): void {
    this.boardForm = this.formBuilder.group({
      title: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    this.owner = this.authService.getLogin();
    const boardData: Board = {
      title: this.boardForm.value.title,
      owner: this.owner,
      users: [],
    };
    this.dialogRef.close({ submitted: true, data: boardData });
  }

  onClose(): void {
    this.dialogRef.close({ submitted: false });
  }
}
