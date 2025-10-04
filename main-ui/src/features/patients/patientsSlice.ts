import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import type { Patient } from './types'

const adapter = createEntityAdapter<Patient>()
const initial = adapter.getInitialState({ loading: false, error: null as string | null })

const slice = createSlice({
  name: 'patients',
  initialState: initial,
  reducers: {
    fetchListRequested(state) { state.loading = true; state.error = null },
    fetchListSucceeded(state, action: PayloadAction<Patient[]>) { state.loading = false; adapter.setAll(state, action.payload) },
    fetchListFailed(state, action: PayloadAction<string>) { state.loading = false; state.error = action.payload },

    createPatientRequested(state, _action: PayloadAction<Omit<Patient, 'id'>>) { state.loading = true },
    createPatientSucceeded(state, action: PayloadAction<Patient>) { state.loading = false; adapter.addOne(state, action.payload) },
    createPatientFailed(state, action: PayloadAction<string>) { state.loading = false; state.error = action.payload },
  },
})

export const {
  fetchListRequested, fetchListSucceeded, fetchListFailed,
  createPatientRequested, createPatientSucceeded, createPatientFailed,
} = slice.actions

export const patientsSelectors = adapter.getSelectors((s: any) => s.patients)
export default slice.reducer