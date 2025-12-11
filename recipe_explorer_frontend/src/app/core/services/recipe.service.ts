import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_ENV } from '../env.token';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RecipeDetail, RecipeSummary, SearchFilters, SearchResult } from '../models/recipe.models';
import { mockGetRecipe, mockSearchRecipes } from './mock-data';

/**
 * PUBLIC_INTERFACE
 * Provides methods to search and retrieve recipe details.
 * It uses NG_APP_API_BASE when available; otherwise, can fallback to mock data when feature.mockData is true.
 */
@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(APP_ENV);

  private get useMock(): boolean {
    const ff = this.env.featureFlags as any;
    const flag = ff?.mockData;
    if (this.env.apiBase && this.env.apiBase.trim().length > 0) return false;
    return flag === true; // only use mock if explicitly enabled or apiBase is empty and mock flag is true
  }

  searchRecipes(query: string, filters: SearchFilters | undefined, page = 1, pageSize = 12): Observable<SearchResult> {
    if (this.useMock) {
      return from(mockSearchRecipes(query, filters, page, pageSize));
    }
    const base = (this.env.apiBase || '').replace(/\/+$/, '');
    if (!base) {
      // Graceful empty state
      return of({ items: [], total: 0, page, pageSize });
    }
    const params: string[] = [];
    if (query) params.push(`q=${encodeURIComponent(query)}`);
    if (filters?.minRating !== undefined) params.push(`minRating=${filters.minRating}`);
    if (filters?.tags?.length) params.push(`tags=${encodeURIComponent(filters.tags.join(','))}`);
    params.push(`page=${page}`);
    params.push(`pageSize=${pageSize}`);
    const url = `${base}/recipes/search?${params.join('&')}`;
    return this.http.get<SearchResult>(url).pipe(
      catchError(() => of({ items: [], total: 0, page, pageSize }))
    );
  }

  getRecipe(id: string): Observable<RecipeDetail | undefined> {
    if (this.useMock) {
      return from(mockGetRecipe(id));
    }
    const base = (this.env.apiBase || '').replace(/\/+$/, '');
    if (!base) {
      return of(undefined);
    }
    const url = `${base}/recipes/${encodeURIComponent(id)}`;
    return this.http.get<RecipeDetail>(url).pipe(
      map(v => v as RecipeDetail),
      catchError(() => of(undefined))
    );
  }
}
