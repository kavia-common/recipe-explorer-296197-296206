import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeSummary } from '../../core/models/recipe.models';

/**
 * Card for a recipe in the grid.
 */
@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <article class="card" [attr.aria-label]="recipe.title">
      <a [routerLink]="['/recipe', recipe.id]" class="card-link" id="qa-recipe-card-{{recipe.id}}">
        <img [src]="recipe.imageUrl" [alt]="recipe.title + ' photo'" loading="lazy" />
        <div class="content">
          <h3 class="title">{{ recipe.title }}</h3>
          <div class="meta">
            <span class="rating" aria-label="Rating">{{ recipe.rating.toFixed(1) }} ★</span>
            <div class="tags">
              <span *ngFor="let t of recipe.tags" class="tag">{{ t }}</span>
            </div>
          </div>
        </div>
      </a>
    </article>
  `,
  styleUrls: ['./recipe-card.component.css']
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: RecipeSummary;
}
