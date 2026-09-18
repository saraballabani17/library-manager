import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from './api.service';

@Component({
  selector: 'app-admin',
  imports: [RouterLink],
  template: `
    <div class="toolbar">
      <h1>Admin - Users</h1>
      <a routerLink="/books">Back to books</a>
    </div>
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Books</th>
          <th>Admin</th>
          <th>Active</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        @for (user of users(); track user['id']) {
          <tr>
            <td>{{ user['email'] }}</td>
            <td>{{ user['name'] || '-' }}</td>
            <td>{{ user['book_count'] }}</td>
            <td>
              <button (click)="toggleAdmin(user)">{{ user['is_admin'] ? 'Revoke admin' : 'Make admin' }}</button>
            </td>
            <td>
              <button (click)="toggleActive(user)">{{ user['is_active'] ? 'Deactivate' : 'Activate' }}</button>
            </td>
            <td class="actions">
              <button (click)="remove(user)">Delete</button>
            </td>
          </tr>
        }
      </tbody>
    </table>
    <p class="hint">You can't change or delete your own account from here.</p>
  `,
})
export class Admin {
  private api = inject(ApiService);

  users = signal<Record<string, unknown>[]>([]);

  constructor() {
    this.refresh();
  }

  refresh() {
    this.api.getUsers().subscribe((users) => this.users.set(users));
  }

  toggleAdmin(user: Record<string, unknown>) {
    this.api.updateUser(user['id'] as number, { is_admin: !user['is_admin'] }).subscribe(() => this.refresh());
  }

  toggleActive(user: Record<string, unknown>) {
    this.api.updateUser(user['id'] as number, { is_active: !user['is_active'] }).subscribe(() => this.refresh());
  }

  remove(user: Record<string, unknown>) {
    if (!confirm(`Delete ${user['email']}?`)) return;
    this.api.deleteUser(user['id'] as number).subscribe(() => this.refresh());
  }
}
