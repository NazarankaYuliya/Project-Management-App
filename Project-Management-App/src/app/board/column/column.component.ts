import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { AddTaskModalComponent } from 'src/app/modal/add-task-modal/add-task-modal.component';
import { Column, Task } from 'src/app/models/app.models';
import { BackendService } from 'src/app/services/backend.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements OnInit {
  @Input() column!: Column;
  @Input() boardId!: string | null;
  private isModalOpen = false;
  public tasks$!: Observable<Task[]>;

  constructor(
    private backendService: BackendService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    if (this.boardId && this.column._id) {
      this.tasks$ = this.backendService.tasks;

      this.backendService
        .getAllTasks(this.boardId, this.column._id)
        .subscribe();
    }
  }

  deleteColumn(columnsId: string, boadrId: string) {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.confirmationModalOpen(
        'Are you sure you want to delete this column?'
      );

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.backendService.deleteColumn(columnsId, boadrId).subscribe(() => {
            this.backendService.getAllColumns(boadrId).subscribe();
          });
        }
        this.isModalOpen = false;
      });
    }
  }

  addTask() {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.creationModalOpen(
        AddTaskModalComponent,
        { boardId: this.boardId, columnId: this.column._id }
      );
      dialogRef.afterClosed().subscribe(() => {
        this.isModalOpen = false;
      });
    }
  }
}
