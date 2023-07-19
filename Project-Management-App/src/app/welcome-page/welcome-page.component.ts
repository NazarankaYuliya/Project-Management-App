import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { User } from '../models/app.models';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent {}
