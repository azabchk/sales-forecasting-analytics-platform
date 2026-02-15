import type { KpiSummary } from '../types/api'

const labels: Array<{ key: keyof KpiSummary; title: string; hint: string; formatter: (v: number) => string }> = [
  { key: 'total_sales', title: 'Total Sales', hint: 'Сумма продаж за период', formatter: (v) => v.toLocaleString('ru-RU', { maximumFractionDigits: 0 }) },
  { key: 'total_customers', title: 'Total Customers', hint: 'Количество покупателей', formatter: (v) => v.toLocaleString('ru-RU') },
  { key: 'avg_ticket', title: 'Avg Ticket', hint: 'Средний чек', formatter: (v) => v.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) },
  { key: 'avg_daily_sales', title: 'Avg Daily Sales', hint: 'Средние дневные продажи', formatter: (v) => v.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) },
]

export default function KpiCards({ data }: { data: KpiSummary }) {
  return (
    <div className="kpi-grid">
      {labels.map((item) => (
        <div key={item.key} className="kpi-card">
          <span className="kpi-title">{item.title}</span>
          <strong className="kpi-value">{item.formatter(data[item.key])}</strong>
          <span className="kpi-hint">{item.hint}</span>
        </div>
      ))}
    </div>
  )
}
