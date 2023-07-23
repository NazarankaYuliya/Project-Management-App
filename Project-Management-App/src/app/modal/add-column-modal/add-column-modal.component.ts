import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Optional,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Column } from 'src/app/models/app.models';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-add-column-modal',
  templateUrl: './add-column-modal.component.html',
  styleUrls: ['./add-column-modal.component.scss'],
})
export class AddColumnModalComponent implements OnInit {
  columnForm: FormGroup<any> = new FormGroup({});
  boadrId: string = '';

  @Output() columnCreated: EventEmitter<Column> = new EventEmitter<Column>();

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    @Optional() private dialogRef: MatDialogRef<AddColumnModalComponent>
  ) {}

  ngOnInit(): void {
    this.columnForm = this.formBuilder.group({
      title: ['', [Validators.required]],
    });

    this.backendService.getBoardId().subscribe((response) => {
      this.boadrId = response;
    });
  }

  createColumn(): void {
    if (this.columnForm.invalid) {
      return;
    }

    const token = localStorage.getItem('token');
    let order: number = 0;

    if (token) {
      this.backendService.columns$.subscribe((columns: Column[]) => {
        columns.forEach((column, index) => {
          order = index + 1;
        });
      });

      const columnData: Column = {
        title: this.columnForm.value.title,
        order: order,
      };
      this.backendService.createColumn(this.boadrId, columnData).subscribe(
        (responce) => {
          this.columnCreated.emit(responce);
          this.updateColumnsOrder();
          this.dialogRef.close();
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  updateColumnsOrder(): void {
    const currentColumns = this.backendService.columns.getValue();

    currentColumns.forEach((column, index) => {
      column.order = index + 1;
    });
    this.backendService.columns.next(currentColumns);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
