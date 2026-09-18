import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
  is_admin: boolean;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  status: string;
  price: string;
  pages: number;
  owner: number;
  owner_email: string;
}

const TOKEN_KEY = 'token';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => this.currentUser() !== null);
  isAdmin = computed(() => this.currentUser()?.is_admin ?? false);

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  register(email: string, name: string, password: string) {
    return this.http.post('/api/auth/register/', { email, name, password });
  }

  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>('/api/auth/login/', { username: email, password })
      .pipe(tap((res) => localStorage.setItem(TOKEN_KEY, res.token)));
  }

  fetchMe() {
    return this.http.get<User>('/api/auth/me/').pipe(tap((user) => this.currentUser.set(user)));
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigateByUrl('/login');
  }

  getBooks(genre: string, status: string) {
    let url = '/api/books/?';
    if (genre) url += `genre=${genre}&`;
    if (status) url += `status=${status}&`;
    return this.http.get<Book[]>(url);
  }

  getBook(id: number) {
    return this.http.get<Book>(`/api/books/${id}/`);
  }

  createBook(book: Partial<Book>) {
    return this.http.post<Book>('/api/books/', book);
  }

  updateBook(id: number, book: Partial<Book>) {
    return this.http.patch<Book>(`/api/books/${id}/`, book);
  }

  deleteBook(id: number) {
    return this.http.delete(`/api/books/${id}/`);
  }

  askQuestion(question: string) {
    return this.http.post<{ answer: string; table: Record<string, unknown>[] }>('/api/ai/query/', {
      question,
    });
  }

  getUsers() {
    return this.http.get<Record<string, unknown>[]>('/api/admin/users/');
  }

  updateUser(id: number, data: Record<string, unknown>) {
    return this.http.patch(`/api/admin/users/${id}/`, data);
  }

  deleteUser(id: number) {
    return this.http.delete(`/api/admin/users/${id}/`);
  }
}
