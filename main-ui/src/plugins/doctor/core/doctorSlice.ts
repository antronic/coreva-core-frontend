import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { Doctor, Patient } from './types'

interface Visit {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

interface DoctorState {
  currentVisit: Visit | null;
  activePatient: Patient | null;
  doctor: Doctor | null;
  loading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  currentVisit: null,
  activePatient: null,
  doctor: null,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'doctorCore',
  initialState,
  reducers: {
    setCurrentVisit(state, action: PayloadAction<Visit>) {
      state.currentVisit = action.payload;
    },
    setActivePatient(state, action: PayloadAction<Patient>) {
      state.activePatient = action.payload;
    },
    setDoctor(state, action: PayloadAction<Doctor>) {
      state.doctor = action.payload;
    },
    startVisit(state) {
      if (state.currentVisit) {
        state.currentVisit.status = 'in-progress';
      }
    },
    completeVisit(state) {
      if (state.currentVisit) {
        state.currentVisit.status = 'completed';
      }
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
})

export const {
  setCurrentVisit,
  setActivePatient,
  setDoctor,
  startVisit,
  completeVisit,
  setError,
  setLoading,
} = slice.actions

export default slice.reducer