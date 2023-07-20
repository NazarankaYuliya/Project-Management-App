import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddBoardModalComponent } from 'src/app/modal/add-board-modal/add-board-modal.component';
import { ConfirmationModalComponent } from 'src/app/modal/confirmation/confirmation-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private backendService: BackendService,
    public dialog: MatDialog,
    private authService: AuthService,
    private modalService: ModalService
  ) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  openCreateBoardDialog(): void {
    const dialogRef = this.modalService.addBoardModal();

    if (!dialogRef) {
      return;
    }
  }

  logout(): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: { message: 'Are you sure you want to log out?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.logout();
      }
    });
  }

  ngOnInit(): void {}
}
