import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/app.models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup<any> = new FormGroup({});

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    const login = this.authService.getLogin();
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      login: [login, [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    const profileData: User = this.profileForm.value;
    console.log(profileData);
    alert('изменения успешно сохранены');
  }

  onCancel(): void {
    this.router.navigate(['/main-route']);
  }
}
