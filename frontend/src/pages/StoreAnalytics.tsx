import { useEffect, useState } from 'react'
import { getPromoImpact, getSalesTimeseries, getStores } from '../api/endpoints'
import StoreSelector from '../components/StoreSelector'
import SalesChart from '../components/SalesChart'

const DATE_FROM = '2015-01-01'
const DATE_TO = '2015-07-31'

export default function StoreAnalytics() {
  const [stores, setStores] = useState<Array<{ store_id: number }>>([])
  const [storeId, setStoreId] = useState(1)
  const [series, setSeries] = useState<Array<{ period: string; sales: number }>>([])
  const [promo, setPromo] = useState<Array<{ promo: number; avg_sales: number }>>([])

  useEffect(() => {
    getStores().then((s) => {
      setStores(s)
      if (s.length > 0) setStoreId(s[0].store_id)
    })
  }, [])

  useEffect(() => {
    if (!storeId) return
    getSalesTimeseries({ granularity: 'daily', date_from: DATE_FROM, date_to: DATE_TO, store_id: storeId }).then(setSeries)
    getPromoImpact(storeId).then(setPromo)
  }, [storeId])

  return (
    <>
      <h2>Store Analytics</h2>
      {stores.length > 0 && <StoreSelector stores={stores} value={storeId} onChange={setStoreId} />}
      <SalesChart data={series} />
      <h3>Promo Impact</h3>
      <ul>
        {promo.map((p) => (
          <li key={p.promo}>Promo={p.promo}: avg_sales={p.avg_sales.toFixed(2)}</li>
        ))}
      </ul>
    </>
  )
}
