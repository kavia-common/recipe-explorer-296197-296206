import { InjectionToken } from '@angular/core';

/**
 * PUBLIC_INTERFACE
 * Minimal environment interface retained for future API mode re-enablement.
 * In static mode, all values are empty and intentionally ignored.
 */
export interface AppEnv {
  apiBase: string;
  backendUrl: string;
  frontendUrl: string;
  wsUrl: string;
  featureFlags: Record<string, unknown>;
}

/**
 * PUBLIC_INTERFACE
 * Static environment token: returns empty values and is not influenced by runtime env.
 * The app runs fully static with in-memory data and never performs network calls.
 */
export const APP_ENV = new InjectionToken<AppEnv>('APP_ENV', {
  providedIn: 'root',
  factory: (): AppEnv => ({
    apiBase: '',
    backendUrl: '',
    frontendUrl: '',
    wsUrl: '',
    featureFlags: {}, // ignored in static mode
  }),
});
