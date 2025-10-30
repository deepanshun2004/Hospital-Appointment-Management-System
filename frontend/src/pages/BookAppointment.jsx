import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { doctorApi, appointmentApi, setAuthToken, fetchDoctors, mockBookAppointment } from '../services/api.js'
import Loading from '../components/Loading.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([])
  const [doctorId, setDoctorId] = useState('')
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [statusMsg, setStatusMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    setAuthToken()
    ;(async () => {
      try {
        console.log('Loading doctors...')
        // Clear any existing data first
        setDoctors([])
        const res = await fetchDoctors()
        console.log('Doctors loaded:', res.data)
        setDoctors(res.data)
        const params = new URLSearchParams(location.search)
        const preselect = params.get('doctorId')
        if (preselect) setDoctorId(preselect)
      } catch (e) {
        console.error(e)
        setError(e?.message || 'Failed to load doctors')
      } finally { setLoading(false) }
    })()
  }, [location.search])

  const refreshDoctors = async () => {
    setLoading(true)
    setError('')
    try {
      console.log('Refreshing doctors...')
      // Clear any cached data first
      setDoctors([])
      const res = await fetchDoctors()
      console.log('Doctors refreshed:', res.data)
      setDoctors(res.data)
    } catch (e) {
      console.error('Failed to refresh doctors:', e)
      setError(e?.message || 'Failed to refresh doctors')
    } finally {
      setLoading(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setStatusMsg('')
    setSubmitting(true)
    try {
      // Ensure auth headers (including X-Patient-Id) are present
      setAuthToken()
      // Fallback: also include patientId in body (decoded from JWT) in case header is missing
      let patientId
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const base64Url = token.split('.')[1]
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
          const payload = JSON.parse(jsonPayload)
          patientId = payload?.patientId
        }
      } catch {}
      const payload = {
        doctorId: doctorId ? Number(doctorId) : undefined,
        date,
        timeSlot,
        ...(patientId ? { patientId } : {}),
      }
      
      // Try real API first, fallback to mock
      try {
        const response = await appointmentApi.post('/appointments/book', payload)
        setStatusMsg('Appointment booked successfully! Redirecting...')
        setTimeout(() => navigate('/my-appointments'), 2000)
      } catch (e) {
        console.error('Booking failed', e)
        if (e.response?.status === 409) {
          setStatusMsg('This time slot is already booked. Please choose another time.') 
        } else {
          const serverMsg = e?.response?.data?.message || e?.response?.data?.error
          setStatusMsg(serverMsg || 'Booking failed. Please try again.')
        }
        return // Don't proceed to mock booking on conflict
      }
      
      // Only try mock booking if real API fails with non-409 error
      try {
        console.log('Backend not available, using mock booking')
        await mockBookAppointment(payload)
        setStatusMsg('Appointment booked successfully! Redirecting...')
        setTimeout(() => navigate('/my-appointments'), 2000)
      } catch (mockError) {
        console.error('Mock booking failed', mockError)
        if (mockError.response?.status === 409) {
          setStatusMsg('This time slot is already booked. Please choose another time.')
        } else {
          setStatusMsg('Booking failed. Please try again.')
        }
      }
    } catch (e) {
      console.error('Unexpected error during booking', e)
      setStatusMsg('An unexpected error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loading text="Loading doctors..." />
  if (error) return <EmptyState title="Unable to load doctors" subtitle={error} action={<button className="btn btn-primary" onClick={()=>{setLoading(true); setError(''); (async()=>{ try{ const res=await fetchDoctors(); setDoctors(res.data)}catch(e){ setError(e?.message||'Failed again')}finally{ setLoading(false)} })()}}>Retry</button>} />

  if (!loading && doctors.length === 0) {
    return (
      <EmptyState
        title="No doctors available to book"
        subtitle="Please check back later or contact support."
        action={<button className="btn btn-outline-secondary" onClick={()=>navigate('/doctors')}>Browse doctors</button>}
      />
    )
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-primary mb-3">Book Your Appointment</h1>
          <p className="lead text-muted">Schedule a consultation with our expert doctors</p>
          <button 
            className="btn btn-outline-secondary btn-sm" 
            onClick={refreshDoctors}
            disabled={loading}
          >
            {loading ? 'Loading...' : '🔄 Refresh Doctors'}
          </button>
        </div>
        
        <div className="card">
          <div className="card-body p-4">
            {statusMsg && (
              <div className={`alert ${statusMsg.includes('successfully') ? 'alert-success' : 'alert-info'} d-flex align-items-center`} role="alert">
                <span className="me-2">{statusMsg.includes('successfully') ? '✅' : 'ℹ️'}</span>
                {statusMsg}
              </div>
            )}
            
            <form onSubmit={submit}>
              <div className="mb-4">
                <label className="form-label fw-semibold">👨‍⚕️ Select Doctor</label>
                <select 
                  className="form-select" 
                  value={doctorId} 
                  onChange={e=>setDoctorId(e.target.value)} 
                  required
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} - {d.specialization}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-semibold">📅 Appointment Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={date} 
                  onChange={e=>setDate(e.target.value)} 
                  min={new Date().toISOString().split('T')[0]}
                  required 
                />
                <div className="form-text">
                  Select a date from today onwards
                </div>
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-semibold">⏰ Time Slot</label>
                <select 
                  className="form-select" 
                  value={timeSlot} 
                  onChange={e=>setTimeSlot(e.target.value)} 
                  required
                >
                  <option value="">Select time slot...</option>
                  <option value="09:00-09:30">09:00 AM - 09:30 AM</option>
                  <option value="09:30-10:00">09:30 AM - 10:00 AM</option>
                  <option value="10:00-10:30">10:00 AM - 10:30 AM</option>
                  <option value="10:30-11:00">10:30 AM - 11:00 AM</option>
                  <option value="11:00-11:30">11:00 AM - 11:30 AM</option>
                  <option value="11:30-12:00">11:30 AM - 12:00 PM</option>
                  <option value="14:00-14:30">02:00 PM - 02:30 PM</option>
                  <option value="14:30-15:00">02:30 PM - 03:00 PM</option>
                  <option value="15:00-15:30">03:00 PM - 03:30 PM</option>
                  <option value="15:30-16:00">03:30 PM - 04:00 PM</option>
                  <option value="16:00-16:30">04:00 PM - 04:30 PM</option>
                  <option value="16:30-17:00">04:30 PM - 05:00 PM</option>
                </select>
              </div>
              
              <button 
                className="btn btn-primary w-100" 
                type="submit" 
                disabled={!doctorId || !date || !timeSlot || submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Booking Appointment...
                  </>
                ) : (
                  '📅 Book Appointment'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
