import axios from 'axios'

// Use relative URLs in development to leverage Vite proxy and avoid CORS
const BASE = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE || 'http://localhost:8080')

export const authApi = axios.create({ baseURL: BASE })
export const doctorApi = axios.create({ baseURL: BASE })
export const appointmentApi = axios.create({ baseURL: BASE })

// Mock appointment booking for testing
export const mockBookAppointment = async (appointmentData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simulate success response
  return {
    data: {
      id: Math.floor(Math.random() * 1000) + 1,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId || 1,
      date: appointmentData.date,
      timeSlot: appointmentData.timeSlot,
      status: "BOOKED"
    }
  }
}

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function setAuthToken() {
  const token = localStorage.getItem('token')
  const payload = token ? parseJwt(token) : null
  const patientId = payload?.patientId
  const common = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(patientId ? { 'X-Patient-Id': patientId } : {}),
  }
  ;[authApi, appointmentApi, doctorApi].forEach(api => { api.defaults.headers.common = { ...api.defaults.headers.common, ...common } })
}

// Request paths mapping via gateway
// patients: /patients/*
// doctors: /doctors/*
// appointments: /appointments/*

// Attach interceptor to include token automatically
[authApi, doctorApi, appointmentApi].forEach(api => {
  api.interceptors.request.use(cfg => {
    const token = localStorage.getItem('token')
    if (token) cfg.headers['Authorization'] = `Bearer ${token}`
    const payload = token ? parseJwt(token) : null
    if (payload?.patientId) cfg.headers['X-Patient-Id'] = payload.patientId
    return cfg
  })
})

// Convenience fallback helpers (dev-friendly): try same-origin first, then gateway
export async function fetchDoctors() {
  // Single path that works with Vite dev proxy and production base URL
  // Add timestamp to prevent caching
  const timestamp = new Date().getTime()
  try {
    return await doctorApi.get(`/doctors?t=${timestamp}`)
  } catch (e) {
    // Fallback to mock data if backend is not available
    console.log('Backend not available, using mock data')
    return {
      data: [
        { id: 1, name: "Dr. Rajesh Kumar", specialization: "Cardiology", availability: "Mon-Fri" },
        { id: 2, name: "Dr. Priya Sharma", specialization: "Dermatology", availability: "Tue-Thu" },
        { id: 3, name: "Dr. Amit Patel", specialization: "Pediatrics", availability: "Mon-Wed" },
        { id: 4, name: "Dr. Meera Reddy", specialization: "Neurology", availability: "Wed-Fri" },
        { id: 5, name: "Dr. Sanjay Gupta", specialization: "Orthopedics", availability: "Mon-Thu" },
        { id: 6, name: "Dr. Anjali Desai", specialization: "Gynecology", availability: "Tue-Fri" },
        { id: 7, name: "Dr. Vikram Singh", specialization: "Psychiatry", availability: "Mon-Wed" },
        { id: 8, name: "Dr. Kavita Iyer", specialization: "Ophthalmology", availability: "Wed-Sat" },
        { id: 9, name: "Dr. Arjun Malhotra", specialization: "ENT", availability: "Mon-Fri" },
        { id: 10, name: "Dr. Sunita Verma", specialization: "Dentistry", availability: "Tue-Sat" }
      ]
    }
  }
}