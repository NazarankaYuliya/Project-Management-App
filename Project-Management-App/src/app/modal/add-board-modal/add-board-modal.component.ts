import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Optional,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Board } from 'src/app/models/app.models';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-add-board-modal',
  templateUrl: './add-board-modal.component.html',
  styleUrls: ['./add-board-modal.component.scss'],
})
export class AddBoardModalComponent implements OnInit {
  boardForm: FormGroup<any> = new FormGroup({});

  @Output() boardCreated: EventEmitter<Board> = new EventEmitter<Board>();

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    @Optional() private dialogRef: MatDialogRef<AddBoardModalComponent>
  ) {}

  ngOnInit(): void {
    this.boardForm = this.formBuilder.group({
      title: ['', [Validators.required]],
    });
  }

  createBoard(): void {
    if (this.boardForm.invalid) {
      return;
    }

    const token = localStorage.getItem('token');
    const owner = localStorage.getItem('login');

    if (token) {
      const boardData: Board = {
        title: this.boardForm.value.title,
        owner: owner,
        users: [],
      };

      this.backendService.createBoard(boardData).subscribe(
        (response) => {
          this.boardCreated.emit(response);
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
