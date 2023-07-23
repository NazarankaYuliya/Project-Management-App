import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { Board, Column } from '../models/app.models';
import { BackendService } from '../services/backend.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  boardId: string | null = null;
  boardTitle: string | null = null;
  columns$!: Observable<Column[]>;

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.boardId = params.get('id');
      if (this.boardId) {
        this.backendService.setBoardId(this.boardId);
        this.backendService
          .getBoardById(this.boardId)
          .subscribe((board: Board) => {
            this.boardTitle = board.title;
          });
        this.backendService.getAllColumns(this.boardId).subscribe();
      }
    });

    this.columns$ = this.backendService.columns$;
  }

  addColumnModal() {
    this.modalService.addColumnModal();
  }

  deleteColumn(colunmsId: string, boadrId: string) {
    this.modalService.deleteColumnModal(colunmsId, boadrId);
  }

  updateColumnsTitle() {}
}
