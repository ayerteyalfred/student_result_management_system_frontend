import axios from 'axios'
import crypto from '@/services/crypto'

const baseURL = 'https://student-result-management-system-backend.onrender.com/api/'
// const baseURL = 'http://127.0.0.1:8000/api/'

// Create axios instance
const service = axios.create({
  baseURL: baseURL,
  timeout: 25000,
  headers: {
    Accepted: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// Request interceptor
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Token')
    let authToken = token ? `Token ${crypto.decryptData(token, crypto.secretKey())}` : ''

    config.headers['Authorization'] = authToken
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// response pre-processing
service.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('ESGApplication')
    }
    return Promise.reject(error)
  }
)

export default service
