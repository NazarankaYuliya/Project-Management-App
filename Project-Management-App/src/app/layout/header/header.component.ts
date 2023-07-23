import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  openCreateBoardDialog() {
    this.modalService.addBoardModal();
  }

  logout(): void {
    this.modalService.logout();
  }

  ngOnInit(): void {}
}
