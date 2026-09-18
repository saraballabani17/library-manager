import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiService } from './api.service';

@Component({
  selector: 'app-ask',
  imports: [FormsModule],
  template: `
    <div class="ask-page">
      <h1>Ask the library</h1>
      <p class="tagline">{{ api.isAdmin() ? "Questions run over every user's books." : 'Questions run over your own books.' }}</p>

      <form (ngSubmit)="ask(question)">
        <input type="text" [(ngModel)]="question" name="question" placeholder="e.g. Who owns the most books?" />
        <button type="submit">Ask</button>
      </form>

      <div class="examples">
        @for (example of examples; track example) {
          <button type="button" class="chip" (click)="ask(example)">{{ example }}</button>
        }
      </div>

      @if (answer()) {
        <div class="answer">
          <p class="answer-text">{{ answer() }}</p>
          @if (table().length) {
            <table>
              <thead>
                <tr>
                  @for (col of columns(); track col) {
                    <th>{{ col }}</th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (row of table(); track $index) {
                  <tr>
                    @for (col of columns(); track col) {
                      <td>{{ row[col] }}</td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      }
    </div>
  `,
})
export class Ask {
  protected api = inject(ApiService);

  examples = [
    'Who owns the most books?',
    'Which is the most popular book?',
    'Show the five most expensive books.',
    'What is the most common genre?',
    'How many fantasy books are there?',
  ];

  question = '';
  answer = signal('');
  table = signal<Record<string, unknown>[]>([]);

  ask(question: string) {
    if (!question) return;
    this.question = question;
    this.api.askQuestion(question).subscribe((res) => {
      this.answer.set(res.answer);
      this.table.set(res.table);
    });
  }

  columns() {
    return this.table().length ? Object.keys(this.table()[0]) : [];
  }
}
