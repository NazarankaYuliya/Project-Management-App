import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BackendService } from '../services/backend.service';
import { Board } from '../models/app.models';
import { map, Observable } from 'rxjs';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { AddBoardModalComponent } from '../modal/add-board-modal/add-board-modal.component';
import { response } from 'express';

@Component({
  selector: 'app-main-route',
  templateUrl: './main-route.component.html',
  styleUrls: ['./main-route.component.scss'],
})
export class MainRouteComponent implements OnInit {
  boards$!: Observable<Board[]>;
  private isModalOpen = false;

  @Output() boardCreated: EventEmitter<Board> = new EventEmitter<Board>();
  dilogRef: any;

  constructor(
    private backendService: BackendService,
    private authService: AuthService,
    public dialog: MatDialog,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.backendService.getAllBoards().subscribe();

    this.boards$ = this.backendService.boards;
  }

  createBoard() {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.creationModalOpen(
        AddBoardModalComponent
      );
      dialogRef.afterClosed().subscribe((result) => {
        this.isModalOpen = false;

        if (result && result.submitted) {
          this.backendService.createBoard(result.data).subscribe(
            (responce) => {
              this.boardCreated.emit(responce);
              this.dilogRef.close();
            },
            (error) => {
              console.error(error);
            }
          );
        }
      });
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
