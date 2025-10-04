// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { createReducerManager } from './reducerManager';
import { sagaMiddleware } from './sagaManager';

// Core reducers that are always available
import authReducer from '@/features/auth/authSlice';
import patientsReducer from '@/features/patients/patientsSlice';

// Start with core reducers, plugins will add their own dynamically
const coreReducers = {
  auth: authReducer,
  patients: patientsReducer,
};

const reducerManager = createReducerManager(coreReducers);

export const store = configureStore({
  reducer: reducerManager.reduce,
  middleware: (gdm) => gdm({ thunk: false }).concat(sagaMiddleware),
  devTools: import.meta.env.DEV,
});

// Expose managers to plugins for dynamic registration
export type AppStore = typeof store & {
  reducerManager: typeof reducerManager;
};
(store as any).reducerManager = reducerManager;

// Export managers for use by FeatureHost
export { sagaManager } from './sagaManager';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;