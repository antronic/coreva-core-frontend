import http from '@/services/http'
import type { Patient } from './types'

export const PatientsAPI = {
  async list(): Promise<Patient[]> {
    const res = await http.get('/patients')
    return res.data
  },
  async create(body: Omit<Patient, 'id'>): Promise<Patient> {
    const res = await http.post('/patients', body)
    return res.data
  },
}