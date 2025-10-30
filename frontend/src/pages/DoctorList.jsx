import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doctorApi, fetchDoctors } from '../services/api.js'
import Loading from '../components/Loading.jsx'
import EmptyState from '../components/EmptyState.jsx'

// Indian doctor names and specializations
const INDIAN_DOCTORS = [
  { name: "Dr. Rajesh Kumar", specialization: "Cardiology", availability: "Mon-Fri", rating: 4.8, experience: "15+ years", image: "👨‍⚕️" },
  { name: "Dr. Priya Sharma", specialization: "Dermatology", availability: "Tue-Thu", rating: 4.9, experience: "12+ years", image: "👩‍⚕️" },
  { name: "Dr. Amit Patel", specialization: "Pediatrics", availability: "Mon-Wed", rating: 4.7, experience: "18+ years", image: "👨‍⚕️" },
  { name: "Dr. Meera Reddy", specialization: "Neurology", availability: "Wed-Fri", rating: 4.9, experience: "20+ years", image: "👩‍⚕️" },
  { name: "Dr. Sanjay Gupta", specialization: "Orthopedics", availability: "Mon-Thu", rating: 4.6, experience: "14+ years", image: "👨‍⚕️" },
  { name: "Dr. Anjali Desai", specialization: "Gynecology", availability: "Tue-Fri", rating: 4.8, experience: "16+ years", image: "👩‍⚕️" },
  { name: "Dr. Vikram Singh", specialization: "Psychiatry", availability: "Mon-Wed", rating: 4.7, experience: "13+ years", image: "👨‍⚕️" },
  { name: "Dr. Kavita Iyer", specialization: "Ophthalmology", availability: "Wed-Sat", rating: 4.9, experience: "17+ years", image: "👩‍⚕️" },
  { name: "Dr. Arjun Malhotra", specialization: "ENT", availability: "Mon-Fri", rating: 4.5, experience: "11+ years", image: "👨‍⚕️" },
  { name: "Dr. Sunita Verma", specialization: "Dentistry", availability: "Tue-Sat", rating: 4.8, experience: "15+ years", image: "👩‍⚕️" }
]

export default function DoctorList() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [specialization, setSpecialization] = useState('')
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const goBook = (doctorId) => {
    const token = localStorage.getItem('token')
    const target = `/book?doctorId=${doctorId}`
    if (!token) {
      const redirect = encodeURIComponent(target)
      navigate(`/login?redirect=${redirect}`)
    } else {
      navigate(target)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchDoctors()
        // Enhance the doctor data with Indian names and additional info
        const enhancedDoctors = res.data.map((doctor, index) => {
          const indianDoctor = INDIAN_DOCTORS[index % INDIAN_DOCTORS.length]
          return {
            ...doctor,
            name: indianDoctor.name,
            rating: indianDoctor.rating,
            experience: indianDoctor.experience,
            image: indianDoctor.image
          }
        })
        setDoctors(enhancedDoctors)
      } catch (e) {
        console.error(e)
        setError(e?.message || 'Failed to load doctors')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return doctors.filter(d => {
      const matchName = !q || d.name?.toLowerCase().includes(q)
      const matchSpec = !specialization || d.specialization === specialization
      return matchName && matchSpec
    })
  }, [doctors, query, specialization])

  const specializations = useMemo(() => Array.from(new Set(doctors.map(d => d.specialization).filter(Boolean))), [doctors])

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="stars">⭐</span>)
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="stars">⭐</span>)
    }
    return stars
  }

  if (loading) return <Loading text="Loading doctors..." />
  if (error) return <EmptyState title="Unable to load doctors" subtitle={error} action={<button className="btn btn-primary" onClick={()=>{setLoading(true); setError(''); setDoctors([]); (async()=>{ try{ const res=await doctorApi.get('/doctors'); setDoctors(res.data)}catch(e){ setError(e?.message||'Failed again')}finally{ setLoading(false)} })()}}>Retry</button>} />

  return (
    <div>
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">Find Your Doctor</h1>
        <p className="lead text-muted">Connect with India's finest medical specialists for expert care</p>
      </div>

      <div className="search-section">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">🔍</span>
              <input 
                className="form-control" 
                placeholder="Search by doctor name..." 
                value={query} 
                onChange={e=>setQuery(e.target.value)} 
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">🏥</span>
              <select 
                className="form-select" 
                value={specialization} 
                onChange={e=>setSpecialization(e.target.value)}
              >
                <option value="">All Specializations</option>
                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {doctors.length === 0 ? (
        <EmptyState title="No doctors available" subtitle="Please check back later or contact support." />
      ) : filtered.length === 0 ? (
        <EmptyState title="No matches found" subtitle="Try a different name or specialization." action={<button className="btn btn-outline-secondary" onClick={()=>{setQuery(''); setSpecialization('')}}>Clear filters</button>} />
      ) : (
        <div className="row g-4">
          {filtered.map(d => (
            <div key={d.id} className="col-lg-4 col-md-6">
              <div className="doctor-card">
                <div className="doctor-avatar">
                  <span style={{fontSize: '4rem'}}>{d.image}</span>
                </div>
                <div className="doctor-info">
                  <h5 className="doctor-name">{d.name}</h5>
                  <span className="specialization-badge">{d.specialization}</span>
                  <div className="doctor-rating">
                    {renderStars(d.rating)}
                    <span className="ms-2 text-muted">({d.rating})</span>
                  </div>
                  <p className="doctor-availability mb-2">
                    <strong>Experience:</strong> {d.experience}
                  </p>
                  <p className="doctor-availability">
                    <strong>Available:</strong> {d.availability}
                  </p>
                  <button 
                    className="btn btn-primary w-100 mt-auto" 
                    onClick={() => goBook(d.id)}
                  >
                    📅 Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
