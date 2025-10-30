import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [patientName, setPatientName] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    const name = localStorage.getItem('patientName')
    if (name) setPatientName(name)
  }, [token])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('patientName')
    window.location.href = '/'
  }

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          🏥 MediCare Hub
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/doctors">
                👨‍⚕️ Find Doctors
              </Link>
            </li>
            {token && (
              <li className="nav-item">
                <Link className="nav-link" to="/book">
                  📅 Book Appointment
                </Link>
              </li>
            )}
            {token && (
              <li className="nav-item">
                <Link className="nav-link" to="/my-appointments">
                  📋 My Appointments
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto align-items-lg-center">
            {!token && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">🔐 Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">✍️ Register</Link>
                </li>
              </>
            )}

            {token && (
              <>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <span className="me-2">👋</span>
                    <span>Hi, {(patientName && patientName.split(' ')[0]) || 'User'}</span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><Link className="dropdown-item" to="/my-appointments">My Appointments</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" to="/doctors">Find Doctors</Link></li>
                  </ul>
                </li>
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <button className="btn btn-outline-danger" onClick={handleLogout}>🚪 Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
