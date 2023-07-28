import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private isModalOpen = false;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private modalService: ModalService
  ) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.confirmationModalOpen(
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

  ngOnInit(): void {}
}
