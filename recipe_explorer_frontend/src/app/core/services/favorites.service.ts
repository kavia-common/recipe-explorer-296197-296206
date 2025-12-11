import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RecipeDetail, RecipeSummary } from '../models/recipe.models';

const STORAGE_KEY = 'recipe_favorites';

// Toggle to pre-seed a few favorites for demos. Disabled by default.
const ENABLE_SEEDED_FAVORITES = false;
const SEEDED_IDS = ['2', '5', '10'];

/**
 * PUBLIC_INTERFACE
 * FavoritesService manages favorite recipe IDs with localStorage persistence,
 * and exposes a reactive stream for UI components to update without reloads.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly favorites$ = new BehaviorSubject<Set<string>>(this.loadFromStorage());

  /** Helper to read the localStorage value safely */
  private loadFromStorage(): Set<string> {
    try {
      const raw = globalThis?.localStorage?.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        return new Set(Array.isArray(arr) ? arr : []);
      }
      // If none in storage and seeding enabled, start with seeded IDs
      if (ENABLE_SEEDED_FAVORITES) {
        const seeded = new Set(SEEDED_IDS);
        // write once so subsequent reloads keep them unless toggled by user
        this.persist(seeded);
        return seeded;
      }
      return new Set<string>();
    } catch {
      return new Set<string>();
    }
  }

  /** Helper to write to localStorage */
  private persist(set: Set<string>) {
    try {
      const arr = Array.from(set);
      globalThis?.localStorage?.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch {
      // ignore storage errors (e.g., SSR or storage disabled)
    }
  }

  /** Observable stream so components can reactively update */
  get favoritesChanges$(): Observable<Set<string>> {
    return this.favorites$.asObservable();
  }

  // PUBLIC_INTERFACE
  isFavorite(id: string): boolean {
    return this.favorites$.value.has(id);
  }

  // PUBLIC_INTERFACE
  toggleFavorite(id: string): void {
    const next = new Set(this.favorites$.value);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.favorites$.next(next);
    this.persist(next);
  }

  // PUBLIC_INTERFACE
  getFavorites(): string[] {
    return Array.from(this.favorites$.value);
  }

  // PUBLIC_INTERFACE
  getFavoriteRecipes(recipes: (RecipeSummary | RecipeDetail)[]): (RecipeSummary | RecipeDetail)[] {
    const ids = this.favorites$.value;
    return (recipes || []).filter(r => ids.has(r.id));
  }

  /** Count convenience accessor */
  get count(): number {
    return this.favorites$.value.size;
  }
}
