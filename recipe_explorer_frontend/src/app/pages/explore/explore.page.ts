import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
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

const SESSION_KEY_SHOW_DUMP = 'explore_show_dump';

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

        <div class="debug-toggle-wrap">
          <button
            type="button"
            class="debug-toggle-btn"
            (click)="toggleDump()"
            [attr.aria-pressed]="showDump()"
            aria-label="Show data"
            id="qa-explore-show-data"
          >
            {{ showDump() ? 'Hide data' : 'Show data' }}
          </button>
        </div>

        <section
          *ngIf="showDump()"
          class="debug-dump"
          role="region"
          aria-label="Current recipes data"
          id="qa-explore-dump"
        >
          <pre class="debug-pre">{{ prettyRecipes() }}</pre>
        </section>

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

  // Debug toggle state with session persistence (off by default)
  showDump = signal<boolean>(false);

  pageSize = 12;
  bgGradient = 'linear-gradient(135deg, rgba(59,130,246,0.08), #f9fafb)';

  private searchChanges$ = new Subject<void>();
  // Track if the user has interacted (searched or paginated) to control empty-state display.
  hasInteracted = signal<boolean>(false);

  // Pretty-printed JSON bound to the same array as the grid. Recomputes when recipes() changes.
  // When empty, show a helpful placeholder with the expected structure (purely visual).
  prettyRecipes = computed(() => {
    try {
      const arr = this.recipes() as any[];
      if (Array.isArray(arr) && arr.length === 0) {
        const sample = [
          {
            id: "string",
            title: "string",
            image: "string (URL)",
            cuisine: "string",
            diet: "string",
            prepTime: "number (minutes)",
            rating: "number (0-5)",
            tags: ["string", "string"],
            description: "string"
          }
        ];
        return [
          "No results to display. Showing sample structure.",
          JSON.stringify(sample, null, 2)
        ].join("\n");
      }
      return JSON.stringify(arr, null, 2);
    } catch {
      return "No results to display. Showing sample structure.\n[\n  {\n    \"id\": \"string\",\n    \"title\": \"string\",\n    \"image\": \"string (URL)\",\n    \"cuisine\": \"string\",\n    \"diet\": \"string\",\n    \"prepTime\": \"number (minutes)\",\n    \"rating\": \"number (0-5)\",\n    \"tags\": [\"string\", \"string\"],\n    \"description\": \"string\"\n  }\n]";
    }
  });

  ngOnInit(): void {
    // Load debug toggle from session storage (if present)
    try {
      const raw = globalThis?.sessionStorage?.getItem(SESSION_KEY_SHOW_DUMP);
      if (raw === '1') this.showDump.set(true);
    } catch {
      // ignore storage errors
    }

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

  toggleDump() {
    const next = !this.showDump();
    this.showDump.set(next);
    try {
      if (next) {
        globalThis?.sessionStorage?.setItem(SESSION_KEY_SHOW_DUMP, '1');
      } else {
        globalThis?.sessionStorage?.removeItem(SESSION_KEY_SHOW_DUMP);
      }
    } catch {
      // ignore storage errors
    }
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
