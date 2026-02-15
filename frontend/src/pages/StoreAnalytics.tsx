import { useEffect, useMemo, useState } from 'react'
import { getKpiSummary, getPromoImpact, getSalesTimeseries, getStoreAnalytics, getStores } from '../api/endpoints'
import BreakdownBars from '../components/BreakdownBars'
import KpiCards from '../components/KpiCards'
import SalesChart from '../components/SalesChart'
import StoreSelector from '../components/StoreSelector'
import SectionCard from '../components/ui/SectionCard'
import { EmptyBlock, ErrorBlock, SkeletonBlock } from '../components/ui/StateBlock'
import { useApiQuery } from '../hooks/useApiQuery'
import type { Store } from '../types/api'

const DEFAULT_FROM = '2015-01-01'
const DEFAULT_TO = '2015-07-31'

export default function StoreAnalytics() {
  const [stores, setStores] = useState<Store[]>([])
  const [storeId, setStoreId] = useState(1)
  const [dateFrom, setDateFrom] = useState(DEFAULT_FROM)
  const [dateTo, setDateTo] = useState(DEFAULT_TO)

  useEffect(() => {
    getStores().then((data) => {
      setStores(data)
      if (data.length > 0) {
        setStoreId(data[0].store_id)
      }
    })
  }, [])

  const params = useMemo(() => ({ date_from: dateFrom, date_to: dateTo, store_id: storeId }), [dateFrom, dateTo, storeId])

  const kpi = useApiQuery(() => getKpiSummary(params), [dateFrom, dateTo, storeId])
  const series = useApiQuery(() => getSalesTimeseries({ ...params, granularity: 'daily' }), [dateFrom, dateTo, storeId])
  const promo = useApiQuery(() => getPromoImpact(storeId), [storeId])
  const analytics = useApiQuery(() => getStoreAnalytics(storeId, { date_from: dateFrom, date_to: dateTo }), [storeId, dateFrom, dateTo])

  return (
    <div className="page-grid">
      <SectionCard title="Аналитика магазина" subtitle="Фокус на одном магазине: KPI, недельный профиль и влияние промо.">
        <div className="filters-row wrap">
          {stores.length > 0 && <StoreSelector stores={stores} value={storeId} onChange={setStoreId} />}
          <label>С: <input className="input" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} /></label>
          <label>По: <input className="input" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} /></label>
        </div>
        {kpi.loading && <SkeletonBlock height={136} />}
        {kpi.error && <ErrorBlock message={kpi.error} />}
        {kpi.data && <KpiCards data={kpi.data} />}
      </SectionCard>

      <div className="split-grid">
        <SectionCard title="Daily sales trend" subtitle="Дневные продажи выбранного магазина.">
          {series.loading && <SkeletonBlock height={300} />}
          {series.error && <ErrorBlock message={series.error} />}
          {series.data && series.data.length > 0 && <SalesChart data={series.data} />}
          {series.data && series.data.length === 0 && <EmptyBlock title="Нет данных" description="Нет данных по магазину в выбранном периоде." />}
        </SectionCard>
        <SectionCard title="Weekly pattern" subtitle="Средние продажи по дням недели.">
          {analytics.loading && <SkeletonBlock height={260} />}
          {analytics.error && <ErrorBlock message={analytics.error} />}
          {analytics.data && <BreakdownBars data={analytics.data.weekly_pattern} xKey="label" yKey="value" />}
        </SectionCard>
      </div>

      <div className="split-grid">
        <SectionCard title="Promo uplift" subtitle="Средние продажи при активном промо и без него.">
          {promo.loading && <SkeletonBlock height={260} />}
          {promo.error && <ErrorBlock message={promo.error} />}
          {promo.data && <BreakdownBars data={promo.data.map((p) => ({ label: p.promo === 1 ? 'Promo' : 'No Promo', value: p.avg_sales }))} xKey="label" yKey="value" />}
        </SectionCard>
        <SectionCard title="Monthly aggregation" subtitle="Месячная агрегация продаж (аналог heatmap по плотности).">
          {analytics.loading && <SkeletonBlock height={260} />}
          {analytics.error && <ErrorBlock message={analytics.error} />}
          {analytics.data && <BreakdownBars data={analytics.data.monthly_sales} xKey="label" yKey="value" />}
        </SectionCard>
      </div>
    </div>
  )
}
