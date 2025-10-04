// Doctor aftervisit sagas
import { takeEvery, put } from 'redux-saga/effects';
import { markVisitCompleted } from '../aftervisitSlice';

function* handleCompleteVisit(action: any) {
  try {
    // Mock visit completion logic
    console.log('Completing visit:', action.payload);
    yield put(markVisitCompleted());
  } catch (error) {
    console.error('Error completing visit:', error);
  }
}

export default function* watchAftervisit() {
  yield takeEvery('aftervisit/completeVisitRequested', handleCompleteVisit);
}