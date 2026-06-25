const skeletonShimmer: React.CSSProperties = {
  background: 'linear-gradient(90deg, #334155 25%, #475569 50%, #334155 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeleton-shimmer 1.5s infinite',
  borderRadius: '8px',
}

export function SkeletonCard() {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: '#1e293b',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      }}
    >
      <div style={{ ...skeletonShimmer, height: 16, width: '80%', marginBottom: 12 }} />
      <div style={{ ...skeletonShimmer, height: 14, width: '100%', marginBottom: 8 }} />
      <div style={{ ...skeletonShimmer, height: 14, width: '60%' }} />
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ ...skeletonShimmer, height: 14, marginBottom: 8 }} />
      ))}
    </>
  )
}
