import { useMemo, useState } from 'react'
import type { Store } from '../types/api'

export default function StoreSelector({ stores, value, onChange }: { stores: Store[]; value: number; onChange: (value: number) => void }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return stores.slice(0, 100)
    return stores
      .filter((store) => `${store.store_id}`.includes(normalized) || (store.store_type ?? '').toLowerCase().includes(normalized))
      .slice(0, 100)
  }, [query, stores])

  return (
    <div className="selector-wrap">
      <input
        className="input"
        placeholder="Поиск магазина по id или типу..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <select className="input" value={value} onChange={(event) => onChange(Number(event.target.value))}>
        {filtered.map((store) => (
          <option key={store.store_id} value={store.store_id}>
            Store #{store.store_id} ({store.store_type ?? 'N/A'})
          </option>
        ))}
      </select>
    </div>
  )
}
