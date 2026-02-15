import { useEffect, useState } from 'react'
import { getStores, postForecast } from '../api/endpoints'
import StoreSelector from '../components/StoreSelector'
import ForecastChart from '../components/ForecastChart'

export default function Forecast() {
  const [stores, setStores] = useState<Array<{ store_id: number }>>([])
  const [storeId, setStoreId] = useState(1)
  const [horizon, setHorizon] = useState(30)
  const [data, setData] = useState<Array<{ date: string; predicted_sales: number }>>([])

  useEffect(() => {
    getStores().then((s) => {
      setStores(s)
      if (s.length > 0) setStoreId(s[0].store_id)
    })
  }, [])

  const runForecast = async () => {
    const result = await postForecast(storeId, horizon)
    setData(result)
  }

  return (
    <>
      <h2>Forecast</h2>
      {stores.length > 0 && <StoreSelector stores={stores} value={storeId} onChange={setStoreId} />}
      <label style={{ marginLeft: 8 }}>
        Horizon:
        <input type="number" value={horizon} min={1} max={180} onChange={(e) => setHorizon(Number(e.target.value))} />
      </label>
      <button onClick={runForecast} style={{ marginLeft: 8 }}>
        Запустить прогноз
      </button>
      <ForecastChart data={data} />
    </>
  )
}
