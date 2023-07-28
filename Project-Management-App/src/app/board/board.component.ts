import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { Column, Task } from '../models/app.models';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  public boardId: string | null = null;
  public boardTitle: string | null = null;
  public columns$!: Observable<Column[]>;
  public columnsId: string | null = null;
  public tasks$!: Observable<Task[]>;

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.boardId = params.get('id');
      if (this.boardId) {
        this.backendService.setBoardId(this.boardId);
        this.backendService
          .getBoardById(this.boardId)
          .subscribe((board) => (this.boardTitle = board.title));
      }
    });
  }
}
