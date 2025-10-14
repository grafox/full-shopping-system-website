import { Injectable, signal, computed, effect, Signal } from '@angular/core';
import { User, Role } from '../models/user.model';
import { of, Observable, delay, throwError } from 'rxjs';

const AUTH_USER_KEY = 'angular_shop_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private users = signal<User[]>([
    { id: 1, email: 'admin@shop.com', password: 'password123', name: 'Admin', role: Role.Admin },
    { id: 2, email: 'user@shop.com', password: 'password123', name: 'John Doe', role: Role.User },
    { id: 3, email: 'test@shop.com', password: 'password123', name: 'Test User', role: Role.User },
  ]);

  currentUser = signal<User | null>(null);

  isLoggedIn: Signal<boolean>;
  isAdmin: Signal<boolean>;

  constructor() {
    this.isLoggedIn = computed(() => !!this.currentUser());
    this.isAdmin = computed(() => this.currentUser()?.role === Role.Admin);
    
    if (typeof localStorage !== 'undefined') {
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      if (storedUser) {
        this.currentUser.set(JSON.parse(storedUser));
      }
    }
    
    effect(() => {
      if (typeof localStorage !== 'undefined') {
        const user = this.currentUser();
        if (user) {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(AUTH_USER_KEY);
        }
      }
    });
  }

  login(email: string, password: string):Observable<User> {
    const user = this.users().find(u => u.email === email && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      this.currentUser.set(userWithoutPassword);
      return of(userWithoutPassword).pipe(delay(500));
    }
    return throwError(() => new Error('Invalid email or password')).pipe(delay(500));
  }

  logout(): void {
    this.currentUser.set(null);
  }

  getUsers(): Observable<User[]> {
    return of(this.users().map(({ password, ...user }) => user)).pipe(delay(100));
  }

  getUserById(id: number): Observable<User | undefined> {
    const user = this.users().find(u => u.id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return of(userWithoutPassword).pipe(delay(100));
    }
    return of(undefined).pipe(delay(100));
  }

  addUser(userData: Omit<User, 'id'>): Observable<User> {
    const newId = this.users().length > 0 ? Math.max(...this.users().map(u => u.id)) + 1 : 1;
    const newUser: User = { ...userData, id: newId };
    this.users.update(users => [...users, newUser]);
    const { password, ...userWithoutPassword } = newUser;
    return of(userWithoutPassword).pipe(delay(100));
  }

  updateUser(updatedUser: User): Observable<User> {
    let userToReturn: User | undefined;
    this.users.update(users => 
      users.map(u => {
        if (u.id === updatedUser.id) {
          const userWithUpdatedData = { ...u, ...updatedUser };
          // If password is not provided or empty, keep the old one.
          if (!updatedUser.password) {
            userWithUpdatedData.password = u.password;
          }
          userToReturn = userWithUpdatedData;
          return userWithUpdatedData;
        }
        return u;
      })
    );
    const { password, ...userWithoutPassword } = userToReturn!;
    return of(userWithoutPassword).pipe(delay(100));
  }
  
  deleteUser(userId: number): Observable<{ success: boolean }> {
    this.users.update(users => users.filter(u => u.id !== userId));
    return of({ success: true }).pipe(delay(100));
  }
}