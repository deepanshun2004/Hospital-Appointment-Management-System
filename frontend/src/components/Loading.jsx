import React from 'react'

export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner mb-3"></div>
      <h4 className="text-muted">{text}</h4>
    </div>
  )
}


