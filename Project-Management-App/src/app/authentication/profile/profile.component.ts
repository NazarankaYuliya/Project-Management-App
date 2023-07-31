import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/app.models';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup<any> = new FormGroup({});
  userName: string | null = null;
  userLogin: string | null = null;
  private isModalOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private modalService: ModalService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userLogin = this.authService.getLogin();
    this.userName = this.authService.getUserName();
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      login: [this.userLogin, [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    const profileData: User = this.profileForm.value;
    this.authService.updateUser(profileData).subscribe((resp) => {
      if (resp) {
        alert('Changes have been successfully saved');
        this.profileForm.reset();
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/main-route']);
  }

  onDelete(): void {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const dialogRef = this.modalService.confirmationModalOpen(
        'Are you sure you want to delete profile?'
      );

      dialogRef.afterClosed().subscribe((result) => {
        this.isModalOpen = false;

        if (result) {
          this.authService.deleteUser().subscribe(() => {
            this.authService.logout();
          });
        }
      });
    }
  }
}
