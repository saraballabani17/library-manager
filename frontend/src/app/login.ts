import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ApiService } from './api.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-card">
      <h1>Log in</h1>
      <form (ngSubmit)="submit()">
        <label>Email <input type="email" [(ngModel)]="email" name="email" required /></label>
        <label>Password <input type="password" [(ngModel)]="password" name="password" required /></label>
        @if (error()) {
          <p class="form-error">{{ error() }}</p>
        }
        <button type="submit">Log in</button>
      </form>
      <p class="switch">No account? <a routerLink="/register">Register</a></p>
    </div>
  `,
})
export class Login {
  private api = inject(ApiService);
  private router = inject(Router);

  email = '';
  password = '';
  error = signal('');

  submit() {
    this.api.login(this.email, this.password).subscribe({
      next: () => this.api.fetchMe().subscribe(() => this.router.navigateByUrl('/books')),
      error: () => this.error.set('Incorrect email or password.'),
    });
  }
}
