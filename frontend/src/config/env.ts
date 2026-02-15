const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!rawApiBaseUrl || typeof rawApiBaseUrl !== 'string') {
  throw new Error('VITE_API_BASE_URL не задан. Проверьте frontend/.env.local')
}

export const env = {
  apiBaseUrl: rawApiBaseUrl.replace(/\/$/, ''),
  requestTimeoutMs: 10000,
  retryCount: 2,
  cacheTtlMs: 30_000,
}
