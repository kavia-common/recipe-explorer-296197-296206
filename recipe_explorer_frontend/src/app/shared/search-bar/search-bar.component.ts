import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Accessible search bar with ARIA labels and keyboard support.
 */
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form class="search" role="search" aria-label="Recipe search" (submit)="onSubmit($event)">
      <input
        id="qa-search-input"
        [(ngModel)]="query"
        name="q"
        type="search"
        placeholder="Search recipes (e.g., pasta, vegan, chicken)..."
        aria-label="Search recipes"
        (keyup.escape)="clear()"
      />
      <button id="qa-search-submit" type="submit" [attr.aria-label]="'Search ' + query">Search</button>
    </form>
  `,
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Input() query = '';
  @Output() search = new EventEmitter<string>();

  onSubmit(e: unknown) {
    if (e && typeof (e as any).preventDefault === 'function') {
      (e as any).preventDefault();
    }
    this.search.emit(this.query.trim());
  }

  clear() {
    this.query = '';
    this.search.emit(this.query);
  }
}
