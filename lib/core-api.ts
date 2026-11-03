// Kept separate from Wiki loaders so API-only pages do not bundle local Wiki data.
export const getApiBase = (): string => {
  if (process.env.NEXT_PUBLIC_CORE_API_URL) return process.env.NEXT_PUBLIC_CORE_API_URL;
  if (typeof window !== 'undefined') {
    if (window.location.hostname.endsWith('guaguahub.cn')) return 'https://dankecore.guaguahub.cn';
    return `${window.location.protocol}//${window.location.hostname}:3001`;
  }
  return 'http://localhost:3001';
};
