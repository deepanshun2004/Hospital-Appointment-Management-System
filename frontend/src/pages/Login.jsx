import React, { useMemo, useState } from 'react'
import { authApi } from '../services/api.js'
import { useNavigate, Link, useLocation } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = useMemo(() => new URLSearchParams(location.search).get('redirect') || '/', [location.search])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.post('/patients/login', { email, password })
      localStorage.setItem('token', res.data.token)
      if (res.data.name) {
        localStorage.setItem('patientName', res.data.name)
      }
      navigate(redirectTo)
    } catch (e) {
      setError('Invalid credentials. Please check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-primary mb-3">Welcome Back</h1>
          <p className="lead text-muted">Sign in to access your healthcare dashboard</p>
        </div>
        
        <div className="card">
          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger d-flex align-items-center" role="alert">
                <span className="me-2">⚠️</span>
                {error}
              </div>
            )}
            
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">📧 Email Address</label>
                <input 
                  className="form-control" 
                  type="email"
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  value={password} 
                  onChange={e=>setPassword(e.target.value)} 
                  required 
                />
              </div>
              
              <button 
                className="btn btn-primary w-100 mb-3" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Signing In...
                  </>
                ) : (
                  '🔐 Sign In'
                )}
              </button>
              
              <div className="text-center">
                <p className="text-muted mb-0">
                  Don't have an account? 
                  <Link to="/register" className="text-primary text-decoration-none ms-1 fw-semibold">
                    Create one here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
