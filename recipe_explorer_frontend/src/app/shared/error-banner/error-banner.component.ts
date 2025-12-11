import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Displays an error with a retry button.
 */
@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error" role="alert" *ngIf="message">
      <span id="qa-error-message">{{ message }}</span>
      <button id="qa-error-retry" (click)="retry.emit()">Retry</button>
    </div>
  `,
  styleUrls: ['./error-banner.component.css']
})
export class ErrorBannerComponent {
  @Input() message: string | null = 'Something went wrong.';
  @Output() retry = new EventEmitter<void>();
}
