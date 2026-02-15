import { useMemo, useState } from 'react'
import { getKpiBreakdowns, getKpiSummary, getSalesTimeseries, getTopStores } from '../api/endpoints'
import BreakdownBars from '../components/BreakdownBars'
import KpiCards from '../components/KpiCards'
import SalesChart from '../components/SalesChart'
import TopStoresTable from '../components/TopStoresTable'
import SectionCard from '../components/ui/SectionCard'
import { EmptyBlock, ErrorBlock, SkeletonBlock } from '../components/ui/StateBlock'
import { useApiQuery } from '../hooks/useApiQuery'

const DEFAULT_FROM = '2015-01-01'
const DEFAULT_TO = '2015-07-31'

export default function Overview() {
  const [dateFrom, setDateFrom] = useState(DEFAULT_FROM)
  const [dateTo, setDateTo] = useState(DEFAULT_TO)

  const params = useMemo(() => ({ date_from: dateFrom, date_to: dateTo }), [dateFrom, dateTo])

  const kpi = useApiQuery(() => getKpiSummary(params), [dateFrom, dateTo])
  const series = useApiQuery(() => getSalesTimeseries({ ...params, granularity: 'daily' }), [dateFrom, dateTo])
  const breakdowns = useApiQuery(() => getKpiBreakdowns(params), [dateFrom, dateTo])
  const topStores = useApiQuery(() => getTopStores({ ...params, limit: 12 }), [dateFrom, dateTo])

  return (
    <div className="page-grid">
      <SectionCard title="Обзор бизнеса" subtitle="Ключевые показатели и структура продаж за выбранный период.">
        <div className="filters-row">
          <label>С: <input className="input" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} /></label>
          <label>По: <input className="input" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} /></label>
        </div>
        {kpi.loading && <SkeletonBlock height={136} />}
        {kpi.error && <ErrorBlock message={kpi.error} />}
        {kpi.data && <KpiCards data={kpi.data} />}
      </SectionCard>

      <SectionCard title="Динамика продаж" subtitle="Дневной временной ряд, помогает выявить сезонность и аномалии.">
        {series.loading && <SkeletonBlock height={300} />}
        {series.error && <ErrorBlock message={series.error} />}
        {series.data && series.data.length > 0 && <SalesChart data={series.data} />}
        {series.data && series.data.length === 0 && <EmptyBlock title="Нет данных" description="Выберите другой период." />}
      </SectionCard>

      <div className="split-grid">
        <SectionCard title="Sales by StoreType" subtitle="Сумма продаж по типам магазинов.">
          {breakdowns.loading && <SkeletonBlock height={260} />}
          {breakdowns.error && <ErrorBlock message={breakdowns.error} />}
          {breakdowns.data && <BreakdownBars data={breakdowns.data.by_store_type} xKey="label" yKey="value" />}
        </SectionCard>
        <SectionCard title="Promo vs No Promo" subtitle="Средние продажи при промо и без промо.">
          {breakdowns.loading && <SkeletonBlock height={260} />}
          {breakdowns.error && <ErrorBlock message={breakdowns.error} />}
          {breakdowns.data && (
            <BreakdownBars
              data={breakdowns.data.promo_vs_no_promo.map((item) => ({ label: item.promo === 1 ? 'Promo' : 'No Promo', value: item.avg_sales }))}
              xKey="label"
              yKey="value"
            />
          )}
        </SectionCard>
      </div>

      <div className="split-grid">
        <SectionCard title="Holiday impact" subtitle="Средние продажи по типам праздничного флага.">
          {breakdowns.loading && <SkeletonBlock height={260} />}
          {breakdowns.error && <ErrorBlock message={breakdowns.error} />}
          {breakdowns.data && (
            <BreakdownBars
              data={breakdowns.data.holiday_impact.map((item) => ({ label: item.state_holiday, value: item.avg_sales }))}
              xKey="label"
              yKey="value"
            />
          )}
        </SectionCard>
        <SectionCard title="Top stores" subtitle="Топ магазинов по выручке, сортируемая таблица.">
          {topStores.loading && <SkeletonBlock height={260} />}
          {topStores.error && <ErrorBlock message={topStores.error} />}
          {topStores.data && topStores.data.length > 0 && <TopStoresTable rows={topStores.data} />}
          {topStores.data && topStores.data.length === 0 && <EmptyBlock title="Нет данных" description="Топ магазинов не найден для периода." />}
        </SectionCard>
      </div>
    </div>
  )
}
