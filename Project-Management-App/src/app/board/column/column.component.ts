import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AddColumnModalComponent } from 'src/app/modal/add-column-modal/add-column-modal.component';
import { AddTaskModalComponent } from 'src/app/modal/add-task-modal/add-task-modal.component';
import { UpdateColumnModalComponent } from 'src/app/modal/update-column-modal/update-column-modal.component';
import { Column, Task } from 'src/app/models/app.models';
import { BackendService } from 'src/app/services/backend.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnInit {
  @Input() boardId!: string | null;

  columns$!: Observable<Column[]>;
  private isModalOpen = false;

  constructor(
    private backendService: BackendService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    if (this.boardId) {
      this.columns$ = this.backendService.getAllColumns(this.boardId);
    }
  }

  addColumn() {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.creationModalOpen(
        AddColumnModalComponent
      );
      dialogRef.afterClosed().subscribe(() => {
        this.isModalOpen = false;
      });
    }
  }

  updateColumn(columnId: string, columnTitle: string, columnOrder: number) {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.creationModalOpen(
        UpdateColumnModalComponent,
        {
          boardId: this.boardId,
          columnId: columnId,
          columnTitle: columnTitle,
          columnOrder: columnOrder,
        }
      );
      dialogRef.afterClosed().subscribe(() => {
        if (this.boardId) {
          this.columns$ = this.backendService.getAllColumns(this.boardId);
        }
        this.isModalOpen = false;
      });
    }
  }

  deleteColumn(columnId: string, boardId: string) {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.confirmationModalOpen(
        'Are you sure you want to delete this column?'
      );

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.backendService.deleteColumn(columnId, boardId).subscribe(() => {
            this.columns$ = this.backendService.columns$;
          });
        }
        this.isModalOpen = false;
      });
    }
  }
}
