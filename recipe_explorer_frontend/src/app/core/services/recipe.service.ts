import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { RecipeDetail, SearchFilters, SearchResult } from '../models/recipe.models';
import { mockGetRecipe, mockSearchRecipes } from './mock-data';

/**
 * PUBLIC_INTERFACE
 * RecipeService (static mode): always uses in-memory mock data.
 * No HttpClient, no environment variables, and no network requests.
 */
@Injectable({ providedIn: 'root' })
export class RecipeService {
  /**
   * PUBLIC_INTERFACE
   * Search recipes from the embedded mock dataset.
   */
  searchRecipes(query: string, filters: SearchFilters | undefined, page = 1, pageSize = 12): Observable<SearchResult> {
    return from(mockSearchRecipes(query, filters, page, pageSize));
  }

  /**
   * PUBLIC_INTERFACE
   * Get a single recipe by id from the embedded mock dataset.
   */
  getRecipe(id: string): Observable<RecipeDetail | undefined> {
    return from(mockGetRecipe(id));
  }
}
