import http from '@/services/http'
import type { Credentials, Session } from './types'

export const AuthAPI = {
  async login(body: Credentials): Promise<Session> {
    const res = await http.post('/auth/login', body)
    return res.data
  },
  async logout(): Promise<void> {
    await http.post('/auth/logout')
  },
}