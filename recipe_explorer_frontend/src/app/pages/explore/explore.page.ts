import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHeaderComponent } from '../../shared/app-header/app-header.component';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { RecipeGridComponent } from '../../shared/recipe-grid/recipe-grid.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { ErrorBannerComponent } from '../../shared/error-banner/error-banner.component';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { RecipeService } from '../../core/services/recipe.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-explore-page',
  imports: [
    CommonModule,
    AppHeaderComponent,
    SearchBarComponent,
    RecipeGridComponent,
    PaginationComponent,
    ErrorBannerComponent,
    EmptyStateComponent
  ],
  template: `
    <app-header></app-header>

    <main class="container" [style.background]="bgGradient">
      <section class="content">
        <h1 class="visually-hidden">Explore Recipes</h1>
        <app-search-bar [query]="query()" (search)="onSearch($event)"></app-search-bar>

        <app-error-banner
          *ngIf="error()"
          [message]="error()"
          (retry)="refresh()"
        ></app-error-banner>

        <app-recipe-grid
          [recipes]="recipes()"
          [loading]="loading()"
        ></app-recipe-grid>

        <app-empty-state
          *ngIf="!loading() && !error() && recipes().length === 0 && hasInteracted()"
          title="No results"
          subtitle="Try refining your query."
        ></app-empty-state>

        <app-pagination
          [page]="page()"
          [pageSize]="pageSize"
          [total]="total()"
          (pageChange)="onPageChange($event)">
        </app-pagination>
      </section>
    </main>
  `,
  styleUrls: ['./explore.page.css']
})
export class ExplorePage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recipeService = inject(RecipeService);

  query = signal<string>('');
  page = signal<number>(1);
  total = signal<number>(0);
  recipes = signal<any[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  pageSize = 12;
  bgGradient = 'linear-gradient(135deg, rgba(59,130,246,0.08), #f9fafb)';

  private searchChanges$ = new Subject<void>();
  // Track if the user has interacted (searched or paginated) to control empty-state display.
  hasInteracted = signal<boolean>(false);

  ngOnInit(): void {
    // Initialize from query params
    this.route.queryParamMap
      .pipe(
        map((p) => ({
          q: p.get('q') || '',
          page: Number(p.get('page') || '1'),
        })),
        distinctUntilChanged((a, b) => a.q === b.q && a.page === b.page)
      )
      .pipe(takeUntilDestroyed())
      .subscribe(({ q, page }) => {
        const normPage = Number.isFinite(page) && page > 0 ? page : 1;
        const wasInteracted = (q && q.length > 0) || normPage !== 1;
        this.query.set(q);
        this.page.set(normPage);
        // Only mark as interacted if the URL actually specified something
        this.hasInteracted.set(!!wasInteracted);
        this.fetch();
      });

    // Debounce refresh request when inputs change locally
    this.searchChanges$.pipe(debounceTime(150)).pipe(takeUntilDestroyed()).subscribe(() => this.fetch());
  }

  ngOnDestroy(): void {
    // nothing; auto-unsubscribe via takeUntilDestroyed
  }

  onSearch(q: string) {
    this.query.set(q);
    this.page.set(1);
    this.hasInteracted.set(true);
    this.syncUrl();
    this.searchChanges$.next();
  }

  onPageChange(p: number) {
    this.page.set(p);
    this.hasInteracted.set(true);
    this.syncUrl();
    this.searchChanges$.next();
  }

  refresh() {
    this.searchChanges$.next();
  }

  private syncUrl() {
    const q = this.query();
    const page = this.page();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: q || null, page: page > 1 ? page : null },
      queryParamsHandling: 'merge'
    });
  }

  private fetch() {
    const q = this.query();
    const p = this.page();
    this.loading.set(true);
    this.error.set(null);
    this.recipeService.searchRecipes(q, undefined, p, this.pageSize).pipe(takeUntilDestroyed())
      .subscribe({
        next: (res) => {
          this.recipes.set(res.items || []);
          this.total.set(res.total || 0);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Failed to load recipes. Please try again.');
        }
      });
  }
}
