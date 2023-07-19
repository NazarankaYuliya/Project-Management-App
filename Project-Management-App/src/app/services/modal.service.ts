import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddBoardModalComponent } from '../modal/add-board-modal/add-board-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  addBoardModal(): MatDialogRef<AddBoardModalComponent, string> {
    const dialogRef = this.dialog.open(AddBoardModalComponent, {
      width: '400px',
      disableClose: true,
    });

    return dialogRef;
  }
}
