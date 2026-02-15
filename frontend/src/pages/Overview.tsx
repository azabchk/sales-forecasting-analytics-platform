import { useEffect, useState } from 'react'
import { getKpiSummary, getSalesTimeseries } from '../api/endpoints'
import KpiCards from '../components/KpiCards'
import SalesChart from '../components/SalesChart'

const DATE_FROM = '2015-01-01'
const DATE_TO = '2015-07-31'

export default function Overview() {
  const [kpi, setKpi] = useState({ total_sales: 0, total_customers: 0, avg_ticket: 0, avg_daily_sales: 0 })
  const [series, setSeries] = useState<Array<{ period: string; sales: number }>>([])

  useEffect(() => {
    getKpiSummary({ date_from: DATE_FROM, date_to: DATE_TO }).then(setKpi)
    getSalesTimeseries({ granularity: 'monthly', date_from: DATE_FROM, date_to: DATE_TO }).then(setSeries)
  }, [])

  return (
    <>
      <h2>Overview</h2>
      <KpiCards {...kpi} />
      <SalesChart data={series} />
    </>
  )
}
