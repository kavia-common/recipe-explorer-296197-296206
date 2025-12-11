import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Empty state with friendly messaging.
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty" role="status" aria-live="polite">
      <div class="emoji">🔎</div>
      <h2 id="qa-empty-title">{{ title }}</h2>
      <p id="qa-empty-subtitle">{{ subtitle }}</p>
    </div>
  `,
  styleUrls: ['./empty-state.component.css']
})
export class EmptyStateComponent {
  @Input() title = 'No recipes found';
  @Input() subtitle = 'Try a different search or adjust your filters.';
}
