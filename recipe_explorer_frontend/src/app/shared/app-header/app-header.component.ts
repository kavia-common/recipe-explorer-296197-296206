import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * App header with brand and navigation.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="app-header" role="banner" aria-label="Application Header">
      <div class="brand">
        <a routerLink="/" class="brand-link" id="qa-brand">🍽️ Recipe Explorer</a>
      </div>
      <nav aria-label="Main Navigation">
        <a routerLink="/" class="nav-link" id="qa-nav-explore">Explore</a>
        <a routerLink="/favorites" class="nav-link" id="qa-nav-favorites">Favorites</a>
      </nav>
    </header>
  `,
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent {
  @Input() gradient = true;
}
