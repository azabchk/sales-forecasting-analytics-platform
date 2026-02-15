export type KpiSummary = {
  total_sales: number
  total_customers: number
  avg_ticket: number
  avg_daily_sales: number
}

export type Store = {
  store_id: number
  store_type?: string
  assortment?: string
}

export type SalesPoint = {
  period: string
  sales: number
  customers?: number
}

export type BreakdownItem = {
  label: string
  value: number
}

export type PromoBreakdownItem = {
  promo: number
  avg_sales: number
}

export type HolidayBreakdownItem = {
  state_holiday: string
  avg_sales: number
}

export type KpiBreakdowns = {
  by_store_type: BreakdownItem[]
  promo_vs_no_promo: PromoBreakdownItem[]
  holiday_impact: HolidayBreakdownItem[]
}

export type TopStore = {
  store_id: number
  total_sales: number
  avg_daily_sales: number
}

export type StoreAnalytics = {
  weekly_pattern: BreakdownItem[]
  monthly_sales: BreakdownItem[]
}

export type ForecastPoint = {
  date: string
  predicted_sales: number
}
