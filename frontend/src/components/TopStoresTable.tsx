import { useMemo, useState } from 'react'
import type { TopStore } from '../types/api'

export default function TopStoresTable({ rows }: { rows: TopStore[] }) {
  const [sortBy, setSortBy] = useState<'total_sales' | 'avg_daily_sales'>('total_sales')
  const sorted = useMemo(() => [...rows].sort((a, b) => b[sortBy] - a[sortBy]), [rows, sortBy])

  return (
    <div>
      <div className="table-toolbar">
        <span>Сортировка:</span>
        <button className="chip" onClick={() => setSortBy('total_sales')}>Total Sales</button>
        <button className="chip" onClick={() => setSortBy('avg_daily_sales')}>Avg Daily Sales</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Store</th>
            <th>Total Sales</th>
            <th>Avg Daily Sales</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.store_id}>
              <td>#{row.store_id}</td>
              <td>{row.total_sales.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}</td>
              <td>{row.avg_daily_sales.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
