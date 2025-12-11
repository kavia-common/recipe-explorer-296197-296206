import { Component, Input } from '@angular/core';
import { RecipeSummary } from '../../core/models/recipe.models';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { NgFor, NgIf } from '@angular/common';
import { SkeletonCardComponent } from '../loaders/skeleton-card.component';

/**
 * Responsive grid that adapts to viewport width.
 */
@Component({
  selector: 'app-recipe-grid',
  standalone: true,
  imports: [NgFor, NgIf, RecipeCardComponent, SkeletonCardComponent],
  template: `
    <div class="grid" [class.loading]="loading" role="list" aria-label="Recipes Grid" id="qa-recipes-grid">
      <ng-container *ngIf="!loading; else loadingTpl">
        <app-recipe-card *ngFor="let r of recipes" [recipe]="r"></app-recipe-card>
      </ng-container>
      <ng-template #loadingTpl>
        <app-skeleton-card *ngFor="let i of placeholders"></app-skeleton-card>
      </ng-template>
    </div>
  `,
  styleUrls: ['./recipe-grid.component.css']
})
export class RecipeGridComponent {
  @Input() recipes: RecipeSummary[] = [];
  @Input() loading = false;

  placeholders = Array.from({ length: 8 });
}
