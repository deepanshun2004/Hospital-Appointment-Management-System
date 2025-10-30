import React, { useState } from 'react'
import { authApi } from '../services/api.js'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    setLoading(true)
    try {
      await authApi.post('/patients/register', { name, email, password })
      setSuccess('Registration successful! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (e) {
      setError('Registration failed. Please try again with different credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-primary mb-3">Join MediCare Hub</h1>
          <p className="lead text-muted">Create your account to start booking appointments</p>
        </div>
        
        <div className="card">
          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger d-flex align-items-center" role="alert">
                <span className="me-2">⚠️</span>
                {error}
              </div>
            )}
            
            {success && (
              <div className="alert alert-success d-flex align-items-center" role="alert">
                <span className="me-2">✅</span>
                {success}
              </div>
            )}
            
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">👤 Full Name</label>
                <input 
                  className="form-control" 
                  placeholder="Enter your full name"
                  value={name} 
                  onChange={e=>setName(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">📧 Email Address</label>
                <input 
                  className="form-control" 
                  type="email"
                  placeholder="Enter your email address"
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-semibold">🔒 Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Create a strong password"
                  value={password} 
                  onChange={e=>setPassword(e.target.value)} 
                  required 
                />
                <div className="form-text">
                  Password should be at least 6 characters long
                </div>
              </div>
              
              <button 
                className="btn btn-primary w-100 mb-3" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating Account...
                  </>
                ) : (
                  '✨ Create Account'
                )}
              </button>
              
              <div className="text-center">
                <p className="text-muted mb-0">
                  Already have an account? 
                  <a href="/login" className="text-primary text-decoration-none ms-1 fw-semibold">
                    Sign in here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
