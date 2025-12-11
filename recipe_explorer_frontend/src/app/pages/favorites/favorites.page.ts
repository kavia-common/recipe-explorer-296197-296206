import { Component } from '@angular/core';
import { AppHeaderComponent } from '../../shared/app-header/app-header.component';

@Component({
  standalone: true,
  selector: 'app-favorites-page',
  imports: [AppHeaderComponent],
  template: `
    <app-header></app-header>
    <main class="container">
      <section class="content">
        <h1>Favorites</h1>
        <p>Coming soon.</p>
      </section>
    </main>
  `,
  styles: [`
    .container { min-height: 100vh; background: linear-gradient(135deg, rgba(59,130,246,0.08), #f9fafb); }
    .content { max-width: 900px; margin: 0 auto; padding: 20px; }
  `]
})
export class FavoritesPage {}
