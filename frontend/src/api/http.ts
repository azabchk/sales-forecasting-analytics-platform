import axios, { AxiosError } from 'axios'
import { env } from '../config/env'

const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.requestTimeoutMs,
})

const responseCache = new Map<string, { expires: number; data: unknown }>()
const inflight = new Map<string, Promise<unknown>>()

const makeKey = (method: string, url: string, params?: object, data?: object): string =>
  JSON.stringify({ method, url, params: params ?? null, data: data ?? null })

async function requestWithRetry<T>(
  method: 'get' | 'post',
  url: string,
  options: { params?: object; data?: object; cache?: boolean } = {},
): Promise<T> {
  const key = makeKey(method, url, options.params, options.data)
  const shouldUseCache = options.cache ?? method === 'get'

  if (shouldUseCache) {
    const cached = responseCache.get(key)
    if (cached && cached.expires > Date.now()) {
      return cached.data as T
    }
  }

  const current = inflight.get(key)
  if (current) {
    return current as Promise<T>
  }

  const task = (async () => {
    let lastError: unknown = null
    for (let attempt = 0; attempt <= env.retryCount; attempt += 1) {
      try {
        const result = await api.request<T>({ method, url, params: options.params, data: options.data })
        if (shouldUseCache) {
          responseCache.set(key, { expires: Date.now() + env.cacheTtlMs, data: result.data })
        }
        return result.data
      } catch (error) {
        lastError = error
        const axiosError = error as AxiosError
        const status = axiosError.response?.status
        const isRetryable = !status || status >= 500
        if (!isRetryable || attempt === env.retryCount) {
          break
        }
        await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)))
      }
    }
    const fallback = lastError as AxiosError<{ detail?: string }>
    const msg = fallback.response?.data?.detail ?? fallback.message ?? 'Ошибка запроса к API'
    throw new Error(msg)
  })()

  inflight.set(key, task)
  try {
    return await task
  } finally {
    inflight.delete(key)
  }
}

export const http = {
  get: <T>(url: string, params?: object, cache = true) => requestWithRetry<T>('get', url, { params, cache }),
  post: <T>(url: string, data?: object) => requestWithRetry<T>('post', url, { data, cache: false }),
  clearCache: () => responseCache.clear(),
}
