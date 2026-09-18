import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ApiService } from './api.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-card">
      <h1>Create an account</h1>
      <form (ngSubmit)="submit()">
        <label>Name <input type="text" [(ngModel)]="name" name="name" required /></label>
        <label>Email <input type="email" [(ngModel)]="email" name="email" required /></label>
        <label>
          Password
          <input type="password" [(ngModel)]="password" name="password" required minlength="8" />
          <small>At least 8 characters.</small>
        </label>
        @if (error()) {
          <p class="form-error">{{ error() }}</p>
        }
        <button type="submit">Register</button>
      </form>
      <p class="switch">Already have an account? <a routerLink="/login">Log in</a></p>
    </div>
  `,
})
export class Register {
  private api = inject(ApiService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  error = signal('');

  submit() {
    this.api.register(this.email, this.name, this.password).subscribe({
      next: () => {
        this.api.login(this.email, this.password).subscribe(() => {
          this.api.fetchMe().subscribe(() => this.router.navigateByUrl('/books'));
        });
      },
      error: (err: HttpErrorResponse) => {
        const body = err.error as Record<string, string[]> | undefined;
        const firstKey = body ? Object.keys(body)[0] : undefined;
        this.error.set(firstKey ? body![firstKey][0] : 'Could not register.');
      },
    });
  }
}
