import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { Session, Credentials } from './types'

type AuthState = {
  session: Session | null
  loading: boolean
  error?: string | null
}

const initial: AuthState = { session: null, loading: false, error: null }

const slice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: {
    loginRequested(state, _action: PayloadAction<Credentials>) { state.loading = true; state.error = null },
    loginSucceeded(state, action: PayloadAction<Session>) { state.loading = false; state.session = action.payload },
    loginFailed(state, action: PayloadAction<string>) { state.loading = false; state.error = action.payload },
    logoutRequested() {},
    logoutCompleted(state) { state.session = null },
  },
})

export const { loginRequested, loginSucceeded, loginFailed, logoutRequested, logoutCompleted } = slice.actions
export default slice.reducer