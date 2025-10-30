import React from 'react'

export default function EmptyState({ title = 'Nothing here', subtitle = 'Try adjusting your filters or come back later.', action }) {
  return (
    <div className="empty-container">
      <div style={{ fontSize: 64, marginBottom: '1rem' }}>🏥</div>
      <h4 className="text-muted mb-2">{title}</h4>
      <p className="text-muted mb-4">{subtitle}</p>
      {action}
    </div>
  )
}


