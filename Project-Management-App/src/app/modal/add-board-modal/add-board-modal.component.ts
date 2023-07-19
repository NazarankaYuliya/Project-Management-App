import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-board-modal',
  templateUrl: './add-board-modal.component.html',
  styleUrls: ['./add-board-modal.component.scss'],
})
export class AddBoardModalComponent {
  newBoard = { title: '' };

  constructor(private dialogRef: MatDialogRef<AddBoardModalComponent>) {}

  close(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.newBoard.title);
  }
}
