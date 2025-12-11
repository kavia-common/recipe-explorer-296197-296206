import { Routes } from '@angular/router';
import { ExplorePage } from './pages/explore/explore.page';
import { RecipeDetailPage } from './pages/recipe-detail/recipe-detail.page';

export const routes: Routes = [
  { path: '', component: ExplorePage, title: 'Explore Recipes' },
  { path: 'recipe/:id', component: RecipeDetailPage, title: 'Recipe Details' },
  { path: 'favorites', loadComponent: () => import('./pages/favorites/favorites.page').then(m => m.FavoritesPage), title: 'Favorites' },
  { path: '**', redirectTo: '' }
];
