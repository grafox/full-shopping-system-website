import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
})
export class UserListComponent implements OnInit {
  private authService = inject(AuthService);

  users = signal<User[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.authService.getUsers()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(users => this.users.set(users));
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUser(userId).subscribe(() => {
        this.users.update(users => users.filter(u => u.id !== userId));
      });
    }
  }
}