# Recipe Explorer Frontend (Angular)

Modern, responsive UI for browsing and viewing recipes.

## Run
- Dev server (already configured for port 3000):
  `npm start`
  Open the running preview at the provided URL on port 3000.

## Configuration

This app reads environment from NG_APP_* variables when available. Sensible defaults are applied when values are undefined.

Supported variables:
- NG_APP_API_BASE: Base URL for backend API (e.g., https://api.example.com). If empty, the app can fallback to mock data when enabled.
- NG_APP_BACKEND_URL, NG_APP_FRONTEND_URL, NG_APP_WS_URL: Optional URLs for integrations.
- NG_APP_NODE_ENV, NG_APP_ENABLE_SOURCE_MAPS, NG_APP_PORT, NG_APP_TRUST_PROXY, NG_APP_LOG_LEVEL, NG_APP_HEALTHCHECK_PATH: Optional runtime knobs.
- NG_APP_FEATURE_FLAGS: JSON string for feature switches. Example: {"mockData": true}
- NG_APP_EXPERIMENTS_ENABLED: true/false

Mock data:
- When NG_APP_API_BASE is empty and feature flag `mockData` is true, the app uses a local in‑memory dataset and simulates latency. Disable by setting NG_APP_FEATURE_FLAGS to {"mockData": false} or providing NG_APP_API_BASE.

## Routes
- `/` Explore recipes (search + grid + pagination)
- `/recipe/:id` Recipe details
- `/favorites` Placeholder

## Accessibility
- Keyboard focus styles, semantic headings, alt text for images, ARIA labels on search.

## Theme
Ocean Professional:
- Primary `#2563EB`, Secondary/Success `#F59E0B`, Error `#EF4444`, Background `#f9fafb`, Surface `#ffffff`, Text `#111827`.
- Subtle shadows, rounded corners, smooth transitions and gradients.

## Testing hooks
- Elements include ids prefixed with `qa-` for e2e selectors (e.g., `#qa-search-input`, `#qa-recipes-grid`).

## Notes
- If backend endpoints exist, expected routes:
  - GET `${NG_APP_API_BASE}/recipes/search?q=...&tags=...&minRating=...&page=1&pageSize=12`
  - GET `${NG_APP_API_BASE}/recipes/:id`

If endpoints are unavailable, enable the mockData feature flag.
