import { useEffect, useMemo, useState } from 'react'
import { getStores, postForecast } from '../api/endpoints'
import ForecastChart from '../components/ForecastChart'
import StoreSelector from '../components/StoreSelector'
import SectionCard from '../components/ui/SectionCard'
import { EmptyBlock, ErrorBlock, SkeletonBlock } from '../components/ui/StateBlock'
import type { ForecastPoint, Store } from '../types/api'

export default function Forecast() {
  const [stores, setStores] = useState<Store[]>([])
  const [storeId, setStoreId] = useState(1)
  const [horizon, setHorizon] = useState(30)
  const [forecastData, setForecastData] = useState<ForecastPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getStores().then((data) => {
      setStores(data)
      if (data.length > 0) {
        setStoreId(data[0].store_id)
      }
    })
  }, [])

  const horizonOptions = useMemo(() => [7, 14, 30], [])

  const runForecast = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await postForecast(storeId, horizon)
      setForecastData(result)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-grid">
      <SectionCard title="Прогноз продаж" subtitle="Выберите магазин и горизонт прогноза. Точечный прогноз без доверительного интервала.">
        <div className="filters-row wrap">
          {stores.length > 0 && <StoreSelector stores={stores} value={storeId} onChange={setStoreId} />}
          <label>
            Горизонт:
            <select className="input" value={horizon} onChange={(event) => setHorizon(Number(event.target.value))}>
              {horizonOptions.map((option) => (
                <option key={option} value={option}>{option} дней</option>
              ))}
            </select>
          </label>
          <button className="button" onClick={runForecast} disabled={loading}>
            {loading ? 'Расчёт...' : 'Построить прогноз'}
          </button>
        </div>
        <p className="caption">What-if переключатели скрыты, так как текущий backend не принимает promo/holiday-флаги в forecast endpoint.</p>
      </SectionCard>

      <SectionCard title="Forecast chart" subtitle="Прогнозируемые продажи по дням.">
        {loading && <SkeletonBlock height={300} />}
        {!loading && error && <ErrorBlock message={error} />}
        {!loading && !error && forecastData.length > 0 && <ForecastChart data={forecastData} />}
        {!loading && !error && forecastData.length === 0 && <EmptyBlock title="Нет прогноза" description="Нажмите «Построить прогноз» для получения результата." />}
      </SectionCard>
    </div>
  )
}
