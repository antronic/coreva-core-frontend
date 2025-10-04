// Doctor aftervisit slice
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AftervisitState {
  summaryNotes: string;
  prescriptions: Array<{
    id: string;
    medication: string;
    dosage: string;
    duration: string;
  }>;
  followUpDate: string | null;
  nextAppointment: string | null;
  visitCompleted: boolean;
}

const initialState: AftervisitState = {
  summaryNotes: '',
  prescriptions: [],
  followUpDate: null,
  nextAppointment: null,
  visitCompleted: false,
};

const slice = createSlice({
  name: 'doctorAftervisit',
  initialState,
  reducers: {
    updateSummaryNotes(state, action: PayloadAction<string>) {
      state.summaryNotes = action.payload;
    },
    addPrescription(state, action: PayloadAction<Omit<AftervisitState['prescriptions'][0], 'id'>>) {
      state.prescriptions.push({
        ...action.payload,
        id: Date.now().toString(),
      });
    },
    removePrescription(state, action: PayloadAction<string>) {
      state.prescriptions = state.prescriptions.filter(p => p.id !== action.payload);
    },
    setFollowUpDate(state, action: PayloadAction<string>) {
      state.followUpDate = action.payload;
    },
    setNextAppointment(state, action: PayloadAction<string>) {
      state.nextAppointment = action.payload;
    },
    markVisitCompleted(state) {
      state.visitCompleted = true;
    },
  },
});

export const {
  updateSummaryNotes,
  addPrescription,
  removePrescription,
  setFollowUpDate,
  setNextAppointment,
  markVisitCompleted,
} = slice.actions;

export default slice.reducer;