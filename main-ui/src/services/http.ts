import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
})

http.interceptors.request.use(config => {
  // attach token if present
  const raw = localStorage.getItem('coreva_session')
  if (raw) {
    const { token } = JSON.parse(raw)
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default http