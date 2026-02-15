import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function SalesChart({ data, dataKey = 'sales', xKey = 'period' }: { data: Array<Record<string, number | string>>; dataKey?: string; xKey?: string }) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#2a3340" strokeDasharray="3 3" />
          <XAxis dataKey={xKey} stroke="#9eb1c7" tick={{ fontSize: 11 }} />
          <YAxis stroke="#9eb1c7" tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ background: '#0f1722', border: '1px solid #2a3340', color: '#eaf1ff' }} />
          <Line type="monotone" dataKey={dataKey} stroke="#60a5fa" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
