import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddBoardModalComponent } from '../modal/add-board-modal/add-board-modal.component';
import { AddColumnModalComponent } from '../modal/add-column-modal/add-column-modal.component';
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

  creationModalOpen<T>(component: Type<T>): MatDialogRef<T, any> {
    this.isModalOpen = true;
    const dialogRef = this.dialog.open(component, {
      width: '400px',
      disableClose: true,
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

  addBoardModal() {
    if (!this.isModalOpen) {
      const dialogRef = this.creationModalOpen(AddBoardModalComponent);
      dialogRef.afterClosed().subscribe(() => {
        this.isModalOpen = false;
      });
    }
  }

  deleteBoardModal(boardId: string) {
    if (!this.isModalOpen) {
      const dialogRef = this.confirmationModalOpen(
        'Are you sure you want to delete this board?'
      );

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.backendService.deleteBoard(boardId).subscribe(() => {
            this.backendService.getAllBoards().subscribe();
          });
        }
        this.isModalOpen = false;
      });
    }
  }

  addColumnModal() {
    if (!this.isModalOpen) {
      const dialogRef = this.creationModalOpen(AddColumnModalComponent);
      dialogRef.afterClosed().subscribe(() => {
        this.isModalOpen = false;
      });
    }
  }

  deleteColumnModal(columnId: string, boadrId: string) {
    if (!this.isModalOpen) {
      const dialogRef = this.confirmationModalOpen(
        'Are you sure you want to delete this column?'
      );

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.backendService.deleteColumn(columnId, boadrId).subscribe(() => {
            this.backendService.getAllColumns(boadrId).subscribe();
          });
        }
        this.isModalOpen = false;
      });
    }
  }
}
