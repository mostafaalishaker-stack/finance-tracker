interface EmptyStateProps {
  icon?: string
  title: string
  message?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon = '📭', title, message, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.6 }}>{icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#f1f5f9' }}>{title}</h3>
      {message && (
        <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 16, maxWidth: 300, margin: '0 auto 16px' }}>
          {message}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          style={{
            padding: '8px 20px',
            border: '1px solid #22c55e',
            color: '#22c55e',
            borderRadius: 8,
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
