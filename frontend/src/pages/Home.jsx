import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="hero-section">
      <div className="container">
        <h1>Your Health, Our Priority</h1>
        <p>Connect with India's finest medical specialists. Book appointments with experienced doctors, get expert consultations, and receive world-class healthcare at your convenience.</p>
        <div className="d-grid d-sm-flex gap-3 justify-content-center">
          <Link className="btn btn-light btn-lg px-4" to="/doctors">
            👨‍⚕️ Find Doctors
          </Link>
          <Link className="btn btn-outline-light btn-lg px-4" to="/register">
            ✨ Get Started
          </Link>
        </div>
      </div>
      
      <div className="row mt-5 pt-5">
        <div className="col-md-4 text-center mb-4">
          <div className="bg-white bg-opacity-10 p-4 rounded-3">
            <h3>🏥 Expert Care</h3>
            <p>Access to qualified specialists across all medical disciplines</p>
          </div>
        </div>
        <div className="col-md-4 text-center mb-4">
          <div className="bg-white bg-opacity-10 p-4 rounded-3">
            <h3>⏰ Easy Booking</h3>
            <p>Book appointments instantly with real-time availability</p>
          </div>
        </div>
        <div className="col-md-4 text-center mb-4">
          <div className="bg-white bg-opacity-10 p-4 rounded-3">
            <h3>🔒 Secure & Private</h3>
            <p>Your health information is protected with industry-standard security</p>
          </div>
        </div>
      </div>
    </div>
  )
}
