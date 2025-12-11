import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppHeaderComponent } from '../../shared/app-header/app-header.component';
import { ErrorBannerComponent } from '../../shared/error-banner/error-banner.component';
import { RecipeService } from '../../core/services/recipe.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
            <h1 class="title">{{ recipe()!.title }}</h1>
            <div class="meta">
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

  id = signal<string>('');
  recipe = signal<any | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(p => {
      this.id.set(p.get('id') || '');
      this.load();
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
}
