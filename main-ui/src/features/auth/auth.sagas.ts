import { call, put, takeLatest, takeLeading } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Credentials, Session } from './types'
import { loginRequested, loginSucceeded, loginFailed, logoutRequested, logoutCompleted } from './authSlice'
import { AuthAPI } from './auth.api'

function* loginWorker(action: PayloadAction<Credentials>) {
  try {
    const session: Session = yield call(AuthAPI.login, action.payload)
    yield put(loginSucceeded(session))
  } catch (err: any) {
    yield put(loginFailed(err?.message ?? 'Login failed'))
  }
}

function* logoutWorker() {
  try {
    yield call(AuthAPI.logout)
  } finally {
    yield put(logoutCompleted())
  }
}

// takeLatest for idempotent login (last try wins), takeLeading for logout (avoid double taps)
export default function* authSaga() {
  yield takeLatest(loginRequested.type, loginWorker)
  yield takeLeading(logoutRequested.type, logoutWorker)
}