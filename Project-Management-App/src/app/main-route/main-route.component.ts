import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BackendService } from '../services/backend.service';
import { Board } from '../models/app.models';
import { map, Observable } from 'rxjs';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-main-route',
  templateUrl: './main-route.component.html',
  styleUrls: ['./main-route.component.scss'],
})
export class MainRouteComponent implements OnInit {
  boards$!: Observable<Board[]>;
  private isModalOpen = false;

  constructor(
    private backendService: BackendService,
    public dialog: MatDialog,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const login = localStorage.getItem('login');

    this.boards$ = this.backendService.boards.pipe(
      map((boards: Board[]) => boards.filter((board) => board.owner === login))
    );

    if (token) {
      this.backendService.getAllBoards().subscribe();
    }
  }

  deleteBoard(boardId: string): void {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.confirmationModalOpen(
        'Are you sure you want to delete this board?'
      );

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.backendService.deleteBoard(boardId).subscribe(() => {
            this.backendService.getAllBoards().subscribe();
          });
          this.isModalOpen = false;
        }
      });
    }
  }
}
