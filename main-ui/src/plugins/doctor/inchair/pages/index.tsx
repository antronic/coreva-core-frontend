// Inchair page component
import { useSelector, useDispatch } from 'react-redux';
import { startProcedure, pauseTimer, resumeTimer } from '../inchairSlice';
import { useEffect } from 'react'

export default function InchairPage() {
  const dispatch = useDispatch();
  const inchairState = useSelector((state: any) => state.doctorInchair);
  
  // Provide default values if state is not loaded
  const {
    currentProcedure = null,
    timer = { elapsed: 0, isRunning: false },
  } = inchairState || {};

  const handleStartProcedure = () => {
    dispatch(startProcedure('cleaning'));
  };

  const handleToggleTimer = () => {
    if (timer.isRunning) {
      dispatch(pauseTimer());
    } else {
      dispatch(resumeTimer());
    }
  };

  useEffect(() => {
    console.log('InchairPage mounted - state:', inchairState);
  }, [inchairState]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">In-Chair Procedures</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Current Procedure</h2>
          {currentProcedure ? (
            <p className="text-green-600">Active: {currentProcedure}</p>
          ) : (
            <p className="text-gray-500">No active procedure</p>
          )}

          <button
            onClick={handleStartProcedure}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start Cleaning
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Timer</h2>
          <p className="text-2xl font-mono">
            {Math.floor((timer.elapsed || 0) / 60000)}:{(((timer.elapsed || 0) % 60000) / 1000).toFixed(0).padStart(2, '0')}
          </p>

          <button
            onClick={handleToggleTimer}
            className={`mt-2 px-4 py-2 rounded ${
              timer.isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {timer.isRunning ? 'Pause' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
}