import {
  createBrowserRouter, RouterProvider, redirect
} from 'react-router'

import App from '@/App'
import Landing from '@/pages/Landing'
import Login from '@/pages/common/Login'
// import Dashboard from '@/pages/Dashboard'
// import Patients from '@/pages/Patients'
// import RootError from './errors/RootError'
import { http } from '@/services/http'
import type { Session } from '@/features/auth/types'
import type { Patient } from '@/features/patients/types'
import RootError from './errors/RootError'

async function getSession(): Promise<Session | null> {
  try { const { data } = await http.get('/auth/session'); return data ?? null }
  catch { return null }
}

export async function rootLoader() {
  const session = await getSession()
  return { session }
}

export async function loginAction({ request }: { request: Request }) {
  const form = await request.formData()
  await http.post('/auth/login', { email: form.get('email'), password: form.get('password') })
  throw redirect('/dashboard')
}

export async function logoutAction() {
  await http.post('/auth/logout')
  throw redirect('/')
}

export async function requireAuthLoader() {
  const session = await getSession()
  if (!session?.token) throw redirect('/login')
  return { session }
}

export async function patientsLoader() {
  const patients = http.get<Patient[]>('/patients').then(r => r.data)
  return { patients }
}

export async function createPatientAction({ request }: { request: Request }) {
  const form = await request.formData()
  await http.post('/patients', { name: form.get('name'), dob: form.get('dob') })
  throw redirect('/patients') // triggers revalidation
}

const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    loader: rootLoader,
    errorElement: <RootError />,
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'login', element: <Login />, action: loginAction },
      {
        id: 'plugin',
        path: 'app',
        children: [
          // Dynamic feature routes loaded by FeatureHost
          { path: '*', lazy: async () => {
            const FeatureHost = await import('@/app/featureHost');
            return { Component: FeatureHost.default };
          }},
          { path: 'logout', action: logoutAction },
        ],
      },
      // {
      //   id: 'private',
      //   // loader: requireAuthLoader,
      //   children: [
      //     // Dynamic feature routes loaded by FeatureHost
      //     {
      //       path: '*',
      //       lazy: async () => {
      //         const mod = await import('@/app/featureHost');
      //         return { Component: mod.default };
      //       }
      //     },
      //     { path: 'logout', action: logoutAction },
      //   ],
      // },
    ],
  },
])

export default function Routes() {
  return <RouterProvider router={router} />
}