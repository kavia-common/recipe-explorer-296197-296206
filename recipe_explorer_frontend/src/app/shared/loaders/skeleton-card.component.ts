import { Component, Input } from '@angular/core';

/**
 * Skeleton loader for recipe card.
 */
@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  template: `
    <div class="skeleton" [style.--h.px]="height">
      <div class="thumb shimmer"></div>
      <div class="line shimmer"></div>
      <div class="line short shimmer"></div>
    </div>
  `,
  styleUrls: ['./skeleton-card.component.css']
})
export class SkeletonCardComponent {
  @Input() height = 220;
}
