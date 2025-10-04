// Doctor inchair sagas
import { takeEvery, put } from 'redux-saga/effects';
import { startProcedure } from '../inchairSlice';

function* handleStartProcedure(action: any) {
  try {
    // Mock procedure logic
    console.log('Starting procedure:', action.payload);
    yield put(startProcedure(action.payload));
  } catch (error) {
    console.error('Error starting procedure:', error);
  }
}

export default function* watchInchair() {
  yield takeEvery('inchair/startProcedureRequested', handleStartProcedure);
}