import { http } from './http'
import type { ForecastPoint, KpiBreakdowns, KpiSummary, SalesPoint, Store, StoreAnalytics, TopStore } from '../types/api'

export const getStores = () => http.get<Store[]>('/stores')

export const getKpiSummary = (params: { date_from: string; date_to: string; store_id?: number }) =>
  http.get<KpiSummary>('/kpi/summary', params)

export const getSalesTimeseries = (params: {
  granularity: 'daily' | 'monthly'
  date_from: string
  date_to: string
  store_id?: number
}) => http.get<SalesPoint[]>('/sales/timeseries', params)

export const getPromoImpact = (store_id?: number) =>
  http.get<Array<{ store_id: number; promo: number; avg_sales: number; records_count: number }>>('/sales/promo-impact', { store_id })

export const getKpiBreakdowns = (params: { date_from: string; date_to: string; store_id?: number }) =>
  http.get<KpiBreakdowns>('/kpi/breakdowns', params)

export const getTopStores = (params: { date_from: string; date_to: string; limit?: number }) =>
  http.get<TopStore[]>('/kpi/top-stores', params)

export const getStoreAnalytics = (store_id: number, params: { date_from: string; date_to: string }) =>
  http.get<StoreAnalytics>(`/stores/${store_id}/analytics`, params)

export const postForecast = (store_id: number, horizon_days: number) =>
  http.post<ForecastPoint[]>('/forecast', { store_id, horizon_days })
