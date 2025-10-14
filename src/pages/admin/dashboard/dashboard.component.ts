import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink]
})
export class DashboardComponent {
  authService = inject(AuthService);
  currentUser = this.authService.currentUser;
}
