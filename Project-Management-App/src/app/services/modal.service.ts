import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../modal/confirmation/confirmation-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  confirmationModalOpen(
    message: string
  ): MatDialogRef<ConfirmationModalComponent, boolean> {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: { message: message },
    });
    return dialogRef;
  }

  creationModalOpen<T>(component: Type<T>, data?: any): MatDialogRef<T, any> {
    const dialogRef = this.dialog.open(component, {
      width: '400px',
      height: '400px',
      disableClose: true,
      data: data,
    });
    return dialogRef;
  }
}
