import React, { useEffect, useState } from 'react'
import { appointmentApi, setAuthToken } from '../services/api.js'
import Loading from '../components/Loading.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    setAuthToken()
    ;(async () => {
      try {
        const res = await appointmentApi.get('/appointments')
        setAppointments(res.data)
      } catch (e) {
        console.error(e)
      } finally { setLoading(false) }
    })()
  }, [])

  const cancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return
    
    setCancelling(id)
    try {
      await appointmentApi.post('/appointments/cancel', { id })
      setAppointments(prev => prev.filter(a => a.id !== id))
    } catch (e) {
      console.error(e)
      alert('Failed to cancel appointment. Please try again.')
    } finally {
      setCancelling(null)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'CONFIRMED': { class: 'bg-success', text: 'Confirmed', icon: '✅' },
      'PENDING': { class: 'bg-warning', text: 'Pending', icon: '⏳' },
      'CANCELLED': { class: 'bg-danger', text: 'Cancelled', icon: '❌' },
      'COMPLETED': { class: 'bg-info', text: 'Completed', icon: '✅' }
    }
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: status, icon: '✅' }
    
    return (
      <span className={`badge ${config.class} text-white px-3 py-2`}>
        {config.icon} {config.text}
      </span>
    )
  }

  if (loading) return <Loading text="Loading appointments..." />

  if (!loading && appointments.length === 0) {
    return (
      <EmptyState 
        title="No appointments yet" 
        subtitle="Book your first appointment from the Doctors page." 
        action={
          <a href="/doctors" className="btn btn-primary">
            👨‍⚕️ Find Doctors
          </a>
        }
      />
    )
  }

  return (
    <div>
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary mb-3">My Appointments</h1>
        <p className="lead text-muted">Manage your scheduled consultations</p>
      </div>

      <div className="row g-4">
        {appointments.map(a => (
          <div key={a.id} className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="card-title mb-1">📅 Appointment</h5>
                    <p className="text-muted mb-0">Doctor #{a.doctorId}</p>
                  </div>
                  {getStatusBadge(a.status)}
                </div>
                
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <span className="text-primary me-2">📅</span>
                    <strong>Date:</strong>
                    <span className="ms-2">{new Date(a.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  
                  <div className="d-flex align-items-center">
                    <span className="text-primary me-2">⏰</span>
                    <strong>Time:</strong>
                    <span className="ms-2">{a.timeSlot}</span>
                  </div>
                </div>
                
                <button 
                  className="btn btn-outline-danger w-100" 
                  onClick={() => cancel(a.id)}
                  disabled={cancelling === a.id || a.status === 'CANCELLED'}
                >
                  {cancelling === a.id ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Cancelling...
                    </>
                  ) : (
                    '❌ Cancel Appointment'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
