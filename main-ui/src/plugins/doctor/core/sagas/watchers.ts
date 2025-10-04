// Doctor core sagas
import { takeEvery, put } from 'redux-saga/effects';
import { setCurrentVisit, setActivePatient, setError } from '../doctorSlice';

function* handleVisitBootstrap(action: any) {
  try {
    const { visitId } = action.payload;

    // Mock data for development - replace with real API calls
    const mockVisit = {
      id: visitId,
      patientId: 'patient-123',
      doctorId: 'doctor-456',
      date: new Date().toISOString(),
      status: 'in-progress' as const,
    };

    const mockPatient = {
      id: 'patient-123',
      name: 'John Doe',
      dob: '1990-01-01',
      lastVisit: new Date().toISOString(),
    };

    yield put(setCurrentVisit(mockVisit));
    yield put(setActivePatient(mockPatient));
  } catch (error) {
    yield put(setError(error instanceof Error ? error.message : 'Failed to load visit'));
  }
}

export default function* watchDoctorCore() {
  yield takeEvery('doctor/bootstrapVisit', handleVisitBootstrap);
}