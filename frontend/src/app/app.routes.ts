import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { map } from 'rxjs';

import { Admin } from './admin';
import { ApiService } from './api.service';
import { Ask } from './ask';
import { BookForm } from './book-form';
import { Books } from './books';
import { Login } from './login';
import { Register } from './register';

function requireLogin() {
  const api = inject(ApiService);
  const router = inject(Router);
  return api.token ? true : router.createUrlTree(['/login']);
}

function requireAdmin() {
  const api = inject(ApiService);
  const router = inject(Router);
  return api.fetchMe().pipe(map((user) => (user.is_admin ? true : router.createUrlTree(['/books']))));
}

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'books', component: Books, canActivate: [requireLogin] },
  { path: 'books/new', component: BookForm, canActivate: [requireLogin] },
  { path: 'books/:id/edit', component: BookForm, canActivate: [requireLogin] },
  { path: 'ask', component: Ask, canActivate: [requireLogin] },
  { path: 'admin', component: Admin, canActivate: [requireLogin, requireAdmin] },
  { path: '**', redirectTo: 'books' },
];
