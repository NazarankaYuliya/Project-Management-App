import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddBoardModalComponent } from '../modal/add-board-modal/add-board-modal.component';
import { AddColumnModalComponent } from '../modal/add-column-modal/add-column-modal.component';
import { AddTaskModalComponent } from '../modal/add-task-modal/add-task-modal.component';
import { ConfirmationModalComponent } from '../modal/confirmation/confirmation-modal.component';
import { AuthService } from './auth.service';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private isModalOpen = false;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private backendService: BackendService
  ) {}

  confirmationModalOpen(
    message: string
  ): MatDialogRef<ConfirmationModalComponent, boolean> {
    this.isModalOpen = true;
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: { message: message },
    });
    return dialogRef;
  }

  creationModalOpen<T>(component: Type<T>, data?: any): MatDialogRef<T, any> {
    this.isModalOpen = true;
    const dialogRef = this.dialog.open(component, {
      width: '400px',
      height: '400px',
      disableClose: true,
      data: data,
    });
    return dialogRef;
  }

  logout() {
    if (!this.isModalOpen) {
      const dialogRef = this.confirmationModalOpen(
        'Are you sure you want to log out?'
      );

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.authService.logout();
        }
        this.isModalOpen = false;
      });
    }
  }

  addTaskModal(boardId: string, columnId: string) {
    if (!this.isModalOpen) {
      const dialogRef = this.creationModalOpen(AddTaskModalComponent);
      dialogRef.componentInstance.boardId = boardId;
      dialogRef.componentInstance.columnId = columnId;
      dialogRef.afterClosed().subscribe(() => {
        this.isModalOpen = false;
      });
    }
  }

  deleteTaskModal() {}
}
