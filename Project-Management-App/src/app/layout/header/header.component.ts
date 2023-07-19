import { Component } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private backendService: BackendService) {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
}
