import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive]
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  isSidebarOpen = signal(false);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
