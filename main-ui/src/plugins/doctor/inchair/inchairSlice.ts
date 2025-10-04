// Doctor inchair slice
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ProcedureStep {
  id: string;
  name: string;
  completed: boolean;
  duration?: number;
}

interface InchairState {
  currentProcedure: string | null;
  steps: ProcedureStep[];
  timer: {
    startTime: number | null;
    elapsed: number;
    isRunning: boolean;
  };
  notes: string;
}

const initialState: InchairState = {
  currentProcedure: null,
  steps: [],
  timer: {
    startTime: null,
    elapsed: 0,
    isRunning: false,
  },
  notes: '',
};

const slice = createSlice({
  name: 'doctorInchair',
  initialState,
  reducers: {
    startProcedure(state, action: PayloadAction<string>) {
      state.currentProcedure = action.payload;
      state.timer.startTime = Date.now();
      state.timer.isRunning = true;
    },
    completeStep(state, action: PayloadAction<string>) {
      const step = state.steps.find(s => s.id === action.payload);
      if (step) {
        step.completed = true;
      }
    },
    addNote(state, action: PayloadAction<string>) {
      state.notes += action.payload + '\n';
    },
    pauseTimer(state) {
      if (state.timer.isRunning && state.timer.startTime) {
        state.timer.elapsed += Date.now() - state.timer.startTime;
        state.timer.isRunning = false;
        state.timer.startTime = null;
      }
    },
    resumeTimer(state) {
      state.timer.startTime = Date.now();
      state.timer.isRunning = true;
    },
  },
});

export const {
  startProcedure,
  completeStep,
  addNote,
  pauseTimer,
  resumeTimer,
} = slice.actions;

export default slice.reducer;