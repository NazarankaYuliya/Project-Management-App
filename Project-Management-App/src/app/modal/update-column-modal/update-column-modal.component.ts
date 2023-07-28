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
import { Observable } from 'rxjs';
import { Column } from 'src/app/models/app.models';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-update-column-modal',
  templateUrl: './update-column-modal.component.html',
  styleUrls: ['./update-column-modal.component.scss'],
})
export class UpdateColumnModalComponent implements OnInit {
  columnForm: FormGroup<any> = new FormGroup({});
  boardId: string = '';
  columnId: string = '';
  columnTitle!: string;
  columnOrder!: number;

  @Output() columnUpdated: EventEmitter<Column> = new EventEmitter<Column>();

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private authService: AuthService,
    @Optional() private dialogRef: MatDialogRef<UpdateColumnModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    if (data) {
      this.boardId = data.boardId;
      this.columnId = data.columnId;
      this.columnTitle = data.columnTitle;
      this.columnOrder = data.columnOrder;
    }
  }

  ngOnInit(): void {
    this.columnForm = this.formBuilder.group({
      title: [this.columnTitle, [Validators.required]],
    });
  }

  updateColumn(): void {
    if (this.columnForm.invalid) {
      return;
    }

    const token = this.authService.getToken();

    if (token) {
      const columnData: Column = {
        title: this.columnForm.value.title,
        order: this.columnOrder,
      };
      this.backendService
        .updateColumn(this.boardId, this.columnId, columnData)
        .subscribe(
          (responce) => {
            this.columnUpdated.emit(responce);
            this.dialogRef.close();
          },
          (error) => {
            console.error(error);
          }
        );
    }
  }
  closeModal(): void {
    this.dialogRef.close();
  }
}
