import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
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

  signup(form: FormGroup) {
    this.authService.signup(form.value).subscribe(
      (responce) => {
        alert('You are successfully singned up!');
      },
      (error) => {
        if (error.error.statusCode === 409) {
          error.error.message =
            'An account with this name or login already exists..';
          this.router.navigate(['/login']);
        } else if (error.error.statusCode === 400) {
          error.error.message =
            'Invalid input data. Please check your information and try again.';
        } else {
          error.error.message = 'An error occurred. Please try again later.';
        }

        alert(error.error.message);
      }
    );
  }
}
