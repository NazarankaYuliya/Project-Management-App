import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddBoardModalComponent } from 'src/app/modal/add-board-modal/add-board-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private isModalOpen = false;

  constructor(
    private backendService: BackendService,
    public dialog: MatDialog,
    private authService: AuthService,
    private modalService: ModalService
  ) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  createBoard() {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.creationModalOpen(
        AddBoardModalComponent
      );
      dialogRef.afterClosed().subscribe(() => {
        this.isModalOpen = false;
      });
    }
  }

  logout(): void {
    this.modalService.logout();
  }

  ngOnInit(): void {}
}
