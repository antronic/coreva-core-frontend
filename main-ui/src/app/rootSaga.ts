import { all, fork } from 'redux-saga/effects'
// import authSaga from '@/features/auth/auth.sagas'
// import patientsSaga from '@/features/patients/patients.sagas'

export default function* rootSaga() {
  yield all([
    // fork(authSaga), fork(patientsSaga)
  ])
}