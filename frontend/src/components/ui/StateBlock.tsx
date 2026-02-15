export function SkeletonBlock({ height = 120 }: { height?: number }) {
  return <div className="skeleton" style={{ height }} />
}

export function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="state-block error" role="alert">
      <h4>Не удалось загрузить данные</h4>
      <p>{message}</p>
    </div>
  )
}

export function EmptyBlock({ title, description }: { title: string; description: string }) {
  return (
    <div className="state-block empty">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  )
}
