// app/reducerManager.ts
import { combineReducers, type Reducer } from '@reduxjs/toolkit';

export type ReducerManager = {
  reduce: Reducer;
  add: (key: string, reducer: Reducer) => void;
  remove: (key: string) => void;
  getReducerMap: () => Record<string, Reducer>;
};

export function createReducerManager(initialReducers: Record<string, Reducer>): ReducerManager {
  const reducers = { ...initialReducers };
  let combined = combineReducers(reducers);

  return {
    reduce: (state: any, action: any) => {
      // If a new reducer was added, regenerate the combined reducer
      return combined(state, action);
    },

    add: (key: string, reducer: Reducer) => {
      if (!key || reducers[key]) {
        console.warn(`Reducer with key "${key}" already exists or key is invalid`);
        return;
      }

      reducers[key] = reducer;
      combined = combineReducers(reducers);
      console.log(`✅ Added reducer: ${key}`);
    },

    remove: (key: string) => {
      if (!reducers[key]) {
        console.warn(`Reducer with key "${key}" does not exist`);
        return;
      }

      delete reducers[key];
      combined = combineReducers(reducers);
      console.log(`🗑️ Removed reducer: ${key}`);
    },

    getReducerMap: () => ({ ...reducers }),
  };
}