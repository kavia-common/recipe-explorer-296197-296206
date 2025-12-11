import { inject, InjectionToken } from '@angular/core';

/**
 * PUBLIC_INTERFACE
 * Provides application environment values read from NG_APP_* variables injected at runtime or build time.
 */
export interface AppEnv {
  apiBase: string;
  backendUrl: string;
  frontendUrl: string;
  wsUrl: string;
  nodeEnv: string;
  enableSourceMaps: boolean;
  port: number;
  trustProxy: boolean;
  logLevel: string;
  healthcheckPath: string;
  featureFlags: Record<string, unknown>;
  experimentsEnabled: boolean;
}

/**
 * Attempt to read globalThis ENV as a map. This supports environments that inject
 * NG_APP_* vars via process.env like objects, window.ENV, or direct injection.
 */
function readRawEnv(): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  // Read from process.env if available
  const p: any = (globalThis as any)?.process;
  if (p?.env) {
    for (const k of Object.keys(p.env)) {
      if (k.startsWith('NG_APP_')) out[k] = p.env[k];
    }
  }
  // Read from window.ENV if available (client-side)
  const w: any = (globalThis as any);
  if (w?.ENV && typeof w.ENV === 'object') {
    for (const k of Object.keys(w.ENV)) {
      if (k.startsWith('NG_APP_')) out[k] = w.ENV[k];
    }
  }
  return out;
}

/**
 * PUBLIC_INTERFACE
 * An injection token for environment configuration across the app.
 */
export const APP_ENV = new InjectionToken<AppEnv>('APP_ENV', {
  providedIn: 'root',
  factory: (): AppEnv => {
    const raw = readRawEnv();
    // Safely parse feature flags JSON
    let featureFlags: Record<string, unknown> = {};
    try {
      featureFlags = raw['NG_APP_FEATURE_FLAGS'] ? JSON.parse(raw['NG_APP_FEATURE_FLAGS'] as string) : {};
    } catch {
      featureFlags = {};
    }
    const toBool = (val: string | undefined, d = false) =>
      val === 'true' ? true : val === 'false' ? false : d;
    const toNum = (val: string | undefined, d: number) => {
      const n = Number(val);
      return Number.isFinite(n) ? n : d;
    };

    return {
      apiBase: raw['NG_APP_API_BASE'] || '',
      backendUrl: raw['NG_APP_BACKEND_URL'] || '',
      frontendUrl: raw['NG_APP_FRONTEND_URL'] || '',
      wsUrl: raw['NG_APP_WS_URL'] || '',
      nodeEnv: raw['NG_APP_NODE_ENV'] || 'production',
      enableSourceMaps: toBool(raw['NG_APP_ENABLE_SOURCE_MAPS'], false),
      port: toNum(raw['NG_APP_PORT'], 3000),
      trustProxy: toBool(raw['NG_APP_TRUST_PROXY'], false),
      logLevel: raw['NG_APP_LOG_LEVEL'] || 'info',
      healthcheckPath: raw['NG_APP_HEALTHCHECK_PATH'] || '/healthz',
      featureFlags,
      experimentsEnabled: toBool(raw['NG_APP_EXPERIMENTS_ENABLED'], false),
    };
  }
});
