import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiService, Book } from './api.service';

@Component({
  selector: 'app-books',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="toolbar">
      <h1>{{ api.isAdmin() ? 'All Books' : 'My Books' }}</h1>
      <a routerLink="/books/new" class="btn-primary">+ Add book</a>
    </div>

    <div class="filters">
      <label>
        Genre
        <input type="text" [(ngModel)]="genre" (change)="refresh()" placeholder="e.g. Fantasy" />
      </label>
      <label>
        Status
        <select [(ngModel)]="status" (change)="refresh()">
          <option value="">All</option>
          <option value="want">Want to read</option>
          <option value="reading">Reading</option>
          <option value="completed">Completed</option>
        </select>
      </label>
    </div>

    @if (books().length === 0) {
      <p class="empty">No books yet.</p>
    } @else {
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Status</th>
            <th>Price</th>
            <th>Pages</th>
            @if (api.isAdmin()) {
              <th>Owner</th>
            }
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (book of books(); track book.id) {
            <tr>
              <td>{{ book.title }}</td>
              <td>{{ book.author }}</td>
              <td>{{ book.genre }}</td>
              <td>{{ book.status }}</td>
              <td>\${{ book.price }}</td>
              <td>{{ book.pages }}</td>
              @if (api.isAdmin()) {
                <td>{{ book.owner_email }}</td>
              }
              <td class="actions">
                <a [routerLink]="['/books', book.id, 'edit']">Edit</a>
                <button (click)="remove(book)">Delete</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
})
export class Books {
  protected api = inject(ApiService);

  books = signal<Book[]>([]);
  genre = '';
  status = '';

  constructor() {
    this.refresh();
  }

  refresh() {
    this.api.getBooks(this.genre, this.status).subscribe((books) => this.books.set(books));
  }

  remove(book: Book) {
    if (!confirm(`Delete "${book.title}"?`)) return;
    this.api.deleteBook(book.id).subscribe(() => this.refresh());
  }
}
