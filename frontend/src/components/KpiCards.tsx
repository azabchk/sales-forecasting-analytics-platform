type Props = { total_sales: number; total_customers: number; avg_ticket: number; avg_daily_sales: number }

export default function KpiCards(props: Props) {
  const cards = [
    ['Total Sales', props.total_sales.toFixed(2)],
    ['Total Customers', props.total_customers.toString()],
    ['Avg Ticket', props.avg_ticket.toFixed(2)],
    ['Avg Daily Sales', props.avg_daily_sales.toFixed(2)],
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
      {cards.map(([name, value]) => (
        <div key={name} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
          <strong>{name}</strong>
          <div>{value}</div>
        </div>
      ))}
    </div>
  )
}
