import { Component, OnInit, inject, signal } from '@angular/core';
import { AppHeaderComponent } from '../../shared/app-header/app-header.component';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { RecipeGridComponent } from '../../shared/recipe-grid/recipe-grid.component';
import { FavoritesService } from '../../core/services/favorites.service';
import { RecipeService } from '../../core/services/recipe.service';
import { RecipeSummary } from '../../core/models/recipe.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-favorites-page',
  imports: [CommonModule, AppHeaderComponent, EmptyStateComponent, RecipeGridComponent],
  template: `
    <app-header></app-header>
    <main class="container">
      <section class="content">
        <h1 style="margin-bottom: 12px;">Favorites</h1>

        <app-recipe-grid
          [recipes]="favRecipes()"
          [loading]="loading()"
        ></app-recipe-grid>

        <app-empty-state
          *ngIf="!loading() && favRecipes().length === 0"
          title="No favorites yet"
          subtitle="Tap the heart icon on a recipe to add it here."
        ></app-empty-state>
      </section>
    </main>
  `,
  styles: [`
    .container { min-height: 100vh; background: linear-gradient(135deg, rgba(59,130,246,0.08), #f9fafb); }
    .content { max-width: 1100px; margin: 0 auto; padding: 20px; }
  `]
})
export class FavoritesPage implements OnInit {
  private readonly favs = inject(FavoritesService);
  private readonly recipesSvc = inject(RecipeService);

  favRecipes = signal<RecipeSummary[]>([]);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.refresh();
    // React to favorites changes
    this.favs.favoritesChanges$.pipe(takeUntilDestroyed()).subscribe(() => this.refresh());
  }

  private refresh() {
    // We’ll fetch a page with all items then filter; since we have static mock data with few items, this is fine.
    this.loading.set(true);
    // Search with empty query to get all items (assuming enough page size)
    this.recipesSvc.searchRecipes('', undefined, 1, 1000).pipe(takeUntilDestroyed()).subscribe({
      next: (res) => {
        const favsOnly = this.favs.getFavoriteRecipes(res.items) as RecipeSummary[];
        this.favRecipes.set(favsOnly);
        this.loading.set(false);
      },
      error: () => {
        this.favRecipes.set([]);
        this.loading.set(false);
      }
    });
  }
}
