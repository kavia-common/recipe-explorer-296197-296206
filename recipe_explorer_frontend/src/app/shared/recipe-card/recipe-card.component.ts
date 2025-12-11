import { Component, Input, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeSummary } from '../../core/models/recipe.models';
import { FavoritesService } from '../../core/services/favorites.service';

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
      <div class="content" style="padding-top: 0; display: flex; justify-content: flex-end;">
        <button
          type="button"
          class="fav-btn"
          [class.active]="isFav()"
          (click)="toggle($event)"
          [attr.aria-pressed]="isFav()"
          [attr.aria-label]="isFav() ? 'Remove from favorites' : 'Add to favorites'"
          id="qa-fav-toggle-{{recipe.id}}"
          title="{{ isFav() ? 'Remove from favorites' : 'Add to favorites' }}"
        >
          <span aria-hidden="true">{{ isFav() ? '♥' : '♡' }}</span>
        </button>
      </div>
    </article>
  `,
  styleUrls: ['./recipe-card.component.css']
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: RecipeSummary;

  private readonly favs = inject(FavoritesService);
  isFav = computed(() => this.favs.isFavorite(this.recipe?.id));

  // Narrow event type without relying on global DOM lib types to satisfy linter
  toggle(e: { stopPropagation: () => void; preventDefault: () => void }) {
    // prevent link navigation when clicking the button
    e.stopPropagation();
    e.preventDefault();
    if (!this.recipe) return;
    this.favs.toggleFavorite(this.recipe.id);
  }
}
