import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="topbar">
      <a routerLink="/books" class="brand">Library Manager</a>
      <nav>
        @if (api.isLoggedIn()) {
          <a routerLink="/ask">Ask AI</a>
          @if (api.isAdmin()) {
            <a routerLink="/admin">Admin</a>
          }
          <span class="who">{{ api.currentUser()?.name || api.currentUser()?.email }}</span>
          @if (api.isAdmin()) {
            <span class="badge">admin</span>
          }
          <button type="button" (click)="api.logout()">Log out</button>
        } @else {
          <a routerLink="/login">Log in</a>
          <a routerLink="/register">Register</a>
        }
      </nav>
    </header>
    <main class="content">
      <router-outlet />
    </main>
  `,
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected api = inject(ApiService);

  ngOnInit(): void {
    if (this.api.token) {
      this.api.fetchMe().subscribe();
    }
  }
}
