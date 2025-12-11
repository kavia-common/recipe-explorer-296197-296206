# Recipe Explorer Frontend (Angular)

Modern, responsive UI for browsing and viewing recipes.

## Run
- Dev server (already configured for port 3000):
  `npm start`
  Open the running preview at the provided URL on port 3000.

## Mode: Static by default (no network calls)
This application is refactored to run fully static:
- Uses only in-memory mock data bundled in the app.
- Does not read or require any NG_APP_* environment variables at runtime or build time.
- Makes no HTTP or WebSocket calls.

You can run, build, and deploy the app without any environment configuration.

## Favorites (local-only)
- Favorites are stored locally in the browser’s `localStorage` under the key `recipe_favorites`.
- The UI shows a heart toggle on cards and on the recipe detail page.
- The header displays a small badge with the current count and links to `/favorites`.
- The Favorites page lists only your saved recipes; if none, an empty state is shown.
- The feature is fully reactive across pages via a shared service and does not perform any network requests.

To clear your favorites, clear site data in your browser or remove the `recipe_favorites` key from localStorage.

## How to re-enable API mode (optional)
If you later need to connect to a backend API:
1. Re-introduce HttpClient in the app providers:
   - In `src/app/app.config.ts`, add `provideHttpClient()` to the provider list.
2. Update `RecipeService` to use HttpClient when an API base is present:
   - Replace the static-only implementation with a dual-mode version that builds URLs from `APP_ENV.apiBase`.
3. Provide environment values:
   - Wire up `APP_ENV` to read NG_APP_* values as needed (see `src/app/core/env.token.ts` for the static version you can extend).
4. Build-time configuration:
   - Optionally configure environment variables via your hosting platform and expose them at build time.

Until then, the current static mode guarantees there are no outgoing requests.

## Routes
- `/` Explore recipes (search + grid + pagination)
- `/recipe/:id` Recipe details
- `/favorites` Favorite recipes

## Accessibility
- Keyboard focus styles, semantic headings, alt text for images, ARIA labels on search.
- Favorite toggle buttons include `aria-pressed` and accessible labels.

## Theme
Ocean Professional:
- Primary `#2563EB`, Secondary/Success `#F59E0B`, Error `#EF4444`, Background `#f9fafb`, Surface `#ffffff`, Text `#111827`.
- Subtle shadows, rounded corners, smooth transitions and gradients.

## Testing hooks
- Elements include ids prefixed with `qa-` for e2e selectors (e.g., `#qa-search-input`, `#qa-recipes-grid`).
