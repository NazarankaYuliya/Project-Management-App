import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      login: ['', [Validators.required, Validators.minLength(2)]],
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

  login(form: FormGroup) {
    this.backendService.signin(form.value).subscribe(
      (response) => {
        this.router.navigate(['/main-route']);
      },

      (error) => {
        if (error.error.statusCode === 401) {
          error.error.message = 'Invalid login or password. Please try again.';
        } else if (error.error.statusCode === 404) {
          error.error.message = 'Account not found.';
        } else if (error.error.statusCode === 403) {
          error.error.message = 'Account disabled.';
        } else {
          error.error.message = 'An error occurred. Please try again later.';
        }

        alert(error.error.message);
      }
    );
  }
}
