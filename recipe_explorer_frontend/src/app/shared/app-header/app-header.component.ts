import { Component, Input, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../core/services/favorites.service';
import { CommonModule } from '@angular/common';

/**
 * App header with brand and navigation.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <header class="app-header" role="banner" aria-label="Application Header">
      <div class="brand">
        <a routerLink="/" class="brand-link" id="qa-brand">🍽️ Recipe Explorer</a>
      </div>
      <nav aria-label="Main Navigation" style="display:flex; align-items:center;">
        <a routerLink="/" class="nav-link" id="qa-nav-explore">Explore</a>
        <a routerLink="/favorites" class="nav-link" id="qa-nav-favorites" style="position:relative; display:inline-flex; align-items:center; gap:6px;">
          Favorites
          <span *ngIf="count() > 0" class="badge" [attr.aria-label]="count() + ' favorite' + (count()===1 ? '' : 's')" id="qa-fav-count">{{ count() }}</span>
        </a>
      </nav>
    </header>
  `,
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent {
  @Input() gradient = true;

  private readonly favs = inject(FavoritesService);
  private _count = signal<number>(this.favs.count);
  count = computed(() => this._count());

  constructor() {
    // react to changes
    this.favs.favoritesChanges$.subscribe(s => this._count.set(s.size));
  }
}
