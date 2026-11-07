import { afterEach, describe, expect, it, vi } from 'vitest';
import { getApiBase } from '../lib/core-api';
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
describe('Core endpoint environments', () => {
  it('uses the local Core in development', () => { vi.stubEnv('NODE_ENV', 'development'); vi.stubEnv('NEXT_PUBLIC_CORE_API_URL', ''); expect(getApiBase()).toMatch(/:6101$/); });
  it('honors explicit preview and production browser endpoints', () => { vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('NEXT_PUBLIC_CORE_API_URL', 'https://dankecore.guaguahub.cn'); expect(getApiBase()).toBe('https://dankecore.guaguahub.cn'); });
  it('fails if production browser configuration is missing', () => { vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('NEXT_PUBLIC_CORE_API_URL', ''); expect(() => getApiBase()).toThrow('NEXT_PUBLIC_CORE_API_URL'); });
  it('keeps server-only endpoints out of browser selection', () => { vi.stubEnv('CORE_API_INTERNAL_URL', 'http://127.0.0.1:33103'); vi.stubEnv('NEXT_PUBLIC_CORE_API_URL', 'https://dankecore.guaguahub.cn'); expect(getApiBase()).toBe('https://dankecore.guaguahub.cn'); vi.stubGlobal('window', undefined); expect(getApiBase()).toBe('http://127.0.0.1:33103'); });
});
