// Browser and build-time Core endpoints are configured independently.
export const getApiBase = (): string => {
  if (typeof window === 'undefined' && process.env.CORE_API_INTERNAL_URL) return process.env.CORE_API_INTERNAL_URL;
  if (process.env.NEXT_PUBLIC_CORE_API_URL) return process.env.NEXT_PUBLIC_CORE_API_URL;
  if (process.env.NODE_ENV === 'production') throw new Error('NEXT_PUBLIC_CORE_API_URL is required for production builds');
  if (typeof window !== 'undefined') return `${window.location.protocol}//${window.location.hostname}:6101`;
  return 'http://localhost:6101';
};
