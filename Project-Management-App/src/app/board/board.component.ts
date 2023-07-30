import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddColumnModalComponent } from '../modal/add-column-modal/add-column-modal.component';

import { Column } from '../models/app.models';
import { BackendService } from '../services/backend.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  private isModalOpen = false;
  boardId: string | null = null;
  boardTitle: string | null = null;
  columns: Column[] = [];

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.boardId = params.get('id');
      if (this.boardId) {
        this.backendService
          .getBoardById(this.boardId)
          .subscribe((board) => (this.boardTitle = board.title));

        this.backendService.getAllColumns(this.boardId).subscribe((columns) => {
          this.columns = columns;
          this.columns.sort((a, b) => a.order - b.order);
        });
      }
    });
  }

  createColumn() {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.creationModalOpen(
        AddColumnModalComponent
      );

      dialogRef.afterClosed().subscribe((result) => {
        this.isModalOpen = false;

        if (this.boardId && result && result.submitted) {
          const columnData: Column = {
            title: result.data.title,
            order: this.columns.length + 1,
          };

          this.backendService.createColumn(this.boardId, columnData).subscribe(
            (responce) => {
              this.columns.push(responce);
              dialogRef.close();
            },
            (error) => {
              console.error(error);
            }
          );
        }
      });
    }
  }

  handleColumnDeleted(column: Column) {
    const index = this.columns.findIndex((c) => c._id === column._id);
    if (index !== -1) {
      this.columns.splice(index, 1);
      this.columns.forEach((column, i) => (column.order = i + 1));
    }
  }

  handleColumnUpdated(updatedColumn: Column) {
    const existingColumn = this.columns.find(
      (c) => c._id === updatedColumn._id
    );
    if (existingColumn) {
      existingColumn.title = updatedColumn.title;
      existingColumn.order = updatedColumn.order;
    }
  }

  drop(event: CdkDragDrop<Column[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.updateColumnOrder();
  }

  updateColumnOrder() {
    this.columns.forEach((column, index) => {
      if (this.boardId && column._id) {
        this.backendService
          .updateColumn(this.boardId, column._id, {
            title: column.title,
            order: index + 1,
          })
          .subscribe((response) => {
            this.handleColumnUpdated(response);
          });
      }
    });
  }
}
