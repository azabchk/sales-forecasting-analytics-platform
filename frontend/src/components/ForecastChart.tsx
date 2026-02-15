import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function ForecastChart({ data }: { data: Array<{ date: string; predicted_sales: number }> }) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid stroke="#2a3340" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#9eb1c7" tick={{ fontSize: 11 }} />
          <YAxis stroke="#9eb1c7" tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ background: '#0f1722', border: '1px solid #2a3340', color: '#eaf1ff' }} />
          <Area type="monotone" dataKey="predicted_sales" stroke="#22c55e" fill="#22c55e30" />
          <Line type="monotone" dataKey="predicted_sales" stroke="#4ade80" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
