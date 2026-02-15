import { apiClient } from './client'

export const getStores = async () => (await apiClient.get('/stores')).data

export const getKpiSummary = async (params: { date_from: string; date_to: string; store_id?: number }) =>
  (await apiClient.get('/kpi/summary', { params })).data

export const getSalesTimeseries = async (params: {
  granularity: 'daily' | 'monthly'
  date_from: string
  date_to: string
  store_id?: number
}) => (await apiClient.get('/sales/timeseries', { params })).data

export const getPromoImpact = async (store_id?: number) =>
  (await apiClient.get('/sales/promo-impact', { params: { store_id } })).data

export const postForecast = async (store_id: number, horizon_days: number) =>
  (await apiClient.post('/forecast', { store_id, horizon_days })).data
