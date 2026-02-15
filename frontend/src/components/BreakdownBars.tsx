import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function BreakdownBars({ data, xKey, yKey }: { data: Array<Record<string, string | number>>; xKey: string; yKey: string }) {
  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="#2a3340" strokeDasharray="3 3" />
          <XAxis dataKey={xKey} stroke="#9eb1c7" tick={{ fontSize: 11 }} />
          <YAxis stroke="#9eb1c7" tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ background: '#0f1722', border: '1px solid #2a3340', color: '#eaf1ff' }} />
          <Bar dataKey={yKey} fill="#8b5cf6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
