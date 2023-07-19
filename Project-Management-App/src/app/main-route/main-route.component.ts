import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { Board, UserResponse } from '../models/app.models';
import { ModalService } from '../services/modal.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main-route',
  templateUrl: './main-route.component.html',
  styleUrls: ['./main-route.component.scss'],
})
export class MainRouteComponent implements OnInit {
  users: UserResponse[] = [];
  userLogin: string = '';
  boardList: Board[] = [];
  usersBoards: Board[] = [];

  constructor(
    private backendService: BackendService,
    private modalService: ModalService,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    const token = localStorage.getItem('token');
    const login = localStorage.getItem('login');

    if (token && login) {
      try {
        this.users = await this.backendService.getUserList(token).toPromise();

        const user = this.users.find((u) => u.login === login);

        if (user) {
          this.userLogin = user.login;
        } else {
          console.log('User not found');
          return;
        }

        this.boardList = await this.backendService
          .getBoardList(token)
          .toPromise();

        this.usersBoards = this.boardList.filter(
          (board) => board.owner === login
        );

        console.log(this.boardList);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('Login not found');
    }
  }

  createBoard(title: string) {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('Token not found');
      return;
    }

    const newBoard: Board = {
      title: title,
      owner: this.userLogin,
      users: [],
    };

    this.backendService.createBoard(newBoard, token).subscribe(
      (response: Board) => {
        this.boardList.push(response);
        if (response.owner === this.userLogin) {
          this.usersBoards.push(response);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  openModal(): void {
    const dialogRef = this.modalService.addBoardModal();
    dialogRef.afterClosed().subscribe((newBoardTitle) => {
      if (newBoardTitle) {
        this.createBoard(newBoardTitle);
      }
    });
  }
}
