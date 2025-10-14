import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User, Role } from '../../../models/user.model';
import { filter, switchMap, tap } from 'rxjs/operators';

export const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ 'passwordsMismatch': true });
    return { 'passwordsMismatch': true };
  }
  if (confirmPassword?.hasError('passwordsMismatch')) {
    confirmPassword.setErrors(null);
  }
  return null;
};

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = signal(false);
  private userId = signal<number | null>(null);
  pageTitle = signal('Add New User');
  roles = Object.values(Role);

  userForm: FormGroup;

  constructor() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [Role.User, Validators.required],
      password: ['', [Validators.minLength(8)]],
      confirmPassword: ['']
    }, { validators: passwordsMatchValidator });
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      tap(params => {
        const passwordControl = this.userForm.get('password');
        if (params.has('id')) {
          const id = Number(params.get('id'));
          this.isEditMode.set(true);
          this.userId.set(id);
          this.pageTitle.set('Edit User');
          passwordControl?.clearValidators();
          passwordControl?.addValidators(Validators.minLength(8));
        } else {
          passwordControl?.setValidators([Validators.required, Validators.minLength(8)]);
        }
        passwordControl?.updateValueAndValidity();
      }),
      filter(() => this.isEditMode()),
      switchMap(() => this.authService.getUserById(this.userId()!))
    ).subscribe(user => {
      if (user) {
        this.userForm.patchValue(user);
      } else {
        this.router.navigate(['/admin/users']);
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const { confirmPassword, ...userData } = this.userForm.value;

    const operation$ = this.isEditMode()
      ? this.authService.updateUser({ ...userData, id: this.userId()! } as User)
      : this.authService.addUser(userData as Omit<User, 'id'>);
    
    operation$.subscribe(() => {
      this.router.navigate(['/admin/users']);
    });
  }
}
