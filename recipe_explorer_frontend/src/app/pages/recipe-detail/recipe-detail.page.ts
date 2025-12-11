import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppHeaderComponent } from '../../shared/app-header/app-header.component';
import { ErrorBannerComponent } from '../../shared/error-banner/error-banner.component';
import { RecipeService } from '../../core/services/recipe.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FavoritesService } from '../../core/services/favorites.service';

@Component({
  standalone: true,
  selector: 'app-recipe-detail-page',
  imports: [CommonModule, RouterLink, AppHeaderComponent, ErrorBannerComponent],
  template: `
    <app-header></app-header>
    <main class="container">
      <section class="content">
        <a routerLink="/" class="back-link" id="qa-back">← Back to Explore</a>

        <div *ngIf="loading()" class="loading">Loading recipe…</div>
        <app-error-banner *ngIf="error()" [message]="error()" (retry)="load()"></app-error-banner>

        <article *ngIf="recipe()" class="card">
          <img [src]="recipe()!.imageUrl" [alt]="recipe()!.title + ' photo'" class="hero">
          <div class="inner">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
              <h1 class="title" style="margin:0;">{{ recipe()!.title }}</h1>
              <button
                type="button"
                class="fav-btn"
                [class.active]="isFav()"
                (click)="toggleFavorite()"
                [attr.aria-pressed]="isFav()"
                [attr.aria-label]="isFav() ? 'Remove from favorites' : 'Add to favorites'"
                id="qa-fav-toggle-detail-{{recipe()!.id}}"
                title="{{ isFav() ? 'Remove from favorites' : 'Add to favorites' }}"
              >
                <span aria-hidden="true">{{ isFav() ? '♥' : '♡' }}</span>
              </button>
            </div>
            <div class="meta" style="margin-top:10px;">
              <span class="rating">{{ recipe()!.rating.toFixed(1) }} ★</span>
              <div class="tags">
                <span class="tag" *ngFor="let t of recipe()!.tags">{{ t }}</span>
              </div>
            </div>

            <p class="desc">{{ recipe()!.description }}</p>

            <div class="two-col">
              <section>
                <h2>Ingredients</h2>
                <ul>
                  <li *ngFor="let i of recipe()!.ingredients">{{ i }}</li>
                </ul>
              </section>
              <section>
                <h2>Steps</h2>
                <ol>
                  <li *ngFor="let s of recipe()!.steps">{{ s }}</li>
                </ol>
              </section>
            </div>
          </div>
        </article>
      </section>
    </main>
  `,
  styleUrls: ['./recipe-detail.page.css']
})
export class RecipeDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly recipeService = inject(RecipeService);
  private readonly favorites = inject(FavoritesService);

  id = signal<string>('');
  recipe = signal<any | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  isFav = computed(() => {
    const r = this.recipe();
    return r ? this.favorites.isFavorite(r.id) : false;
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(p => {
      this.id.set(p.get('id') || '');
      this.load();
    });

    // Subscribe to favorites changes so computed signals reevaluate
    this.favorites.favoritesChanges$.pipe(takeUntilDestroyed()).subscribe(() => {
      // no-op; computed() will re-run due to accessed service, but subscription
      // ensures change detection runs in case no other triggers occur.
      const current = this.recipe();
      if (current) {
        // touch signal to trigger update
        this.recipe.set({ ...current });
      }
    });
  }

  load() {
    const id = this.id();
    if (!id) return;
    this.loading.set(true);
    this.error.set(null);
    this.recipeService.getRecipe(id).pipe(takeUntilDestroyed()).subscribe({
      next: (r) => {
        this.recipe.set(r || null);
        if (!r) this.error.set('Recipe not found.');
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load recipe. Please try again.');
      }
    });
  }

  toggleFavorite() {
    const r = this.recipe();
    if (!r) return;
    this.favorites.toggleFavorite(r.id);
  }
}
