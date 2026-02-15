export default function StoreSelector({
  stores,
  value,
  onChange,
}: {
  stores: Array<{ store_id: number }>
  value: number
  onChange: (value: number) => void
}) {
  return (
    <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
      {stores.map((s) => (
        <option key={s.store_id} value={s.store_id}>
          Store #{s.store_id}
        </option>
      ))}
    </select>
  )
}
