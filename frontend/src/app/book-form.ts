import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ApiService } from './api.service';

@Component({
  selector: 'app-book-form',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="form-card">
      <h1>{{ bookId ? 'Edit book' : 'Add a book' }}</h1>
      <form (ngSubmit)="submit()">
        <label>Title <input type="text" [(ngModel)]="title" name="title" required /></label>
        <label>Author <input type="text" [(ngModel)]="author" name="author" required /></label>
        <label>Genre <input type="text" [(ngModel)]="genre" name="genre" placeholder="e.g. Fantasy" /></label>
        <label>
          Status
          <select [(ngModel)]="status" name="status">
            <option value="want">Want to read</option>
            <option value="reading">Reading</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label>Price <input type="number" step="0.01" min="0" [(ngModel)]="price" name="price" /></label>
        <label>Pages <input type="number" min="0" [(ngModel)]="pages" name="pages" /></label>
        @if (error()) {
          <p class="form-error">{{ error() }}</p>
        }
        <div class="actions">
          <button type="submit">Save</button>
          <a routerLink="/books">Cancel</a>
        </div>
      </form>
    </div>
  `,
})
export class BookForm {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  bookId: number | null = null;
  title = '';
  author = '';
  genre = '';
  status = 'want';
  price = 0;
  pages = 0;
  error = signal('');

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookId = Number(id);
      this.api.getBook(this.bookId).subscribe((book) => {
        this.title = book.title;
        this.author = book.author;
        this.genre = book.genre;
        this.status = book.status;
        this.price = Number(book.price);
        this.pages = book.pages;
      });
    }
  }

  submit() {
    const data = {
      title: this.title,
      author: this.author,
      genre: this.genre,
      status: this.status,
      price: String(this.price),
      pages: this.pages,
    };
    const request = this.bookId ? this.api.updateBook(this.bookId, data) : this.api.createBook(data);
    request.subscribe({
      next: () => this.router.navigateByUrl('/books'),
      error: () => this.error.set('Could not save that book.'),
    });
  }
}
