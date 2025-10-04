// Aftervisit page component
import { useSelector, useDispatch } from 'react-redux';
import { updateSummaryNotes, addPrescription, markVisitCompleted } from '../aftervisitSlice';
import { useAppSelector } from '@/app/hooks'
import { useEffect } from 'react'

export default function AftervisitPage() {
  const dispatch = useDispatch();
  const { summaryNotes, prescriptions, visitCompleted } = useSelector((state: any) => state.doctorAftervisit);
  const app = useAppSelector(state => state);

  const handleAddPrescription = () => {
    dispatch(addPrescription({
      medication: 'Sample Medication',
      dosage: '500mg',
      duration: '7 days'
    }));
  };

  const handleCompleteVisit = () => {
    dispatch(markVisitCompleted());
  };

  useEffect(() => {
    // console.log('App state changed:', app);
    console.log('After visit page - app state:', app);
  }, [app]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Post-Visit Documentation</h1>

      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Visit Summary</h2>
          <textarea
            value={summaryNotes}
            onChange={(e) => dispatch(updateSummaryNotes(e.target.value))}
            className="w-full h-32 p-2 border rounded resize-none"
            placeholder="Enter visit summary notes..."
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Prescriptions</h2>
          {prescriptions && prescriptions.length > 0 ? (
            <ul className="space-y-2 mb-4">
              {prescriptions.map((prescription: any) => (
                <li key={prescription.id} className="p-2 bg-gray-50 rounded">
                  <strong>{prescription.medication}</strong> - {prescription.dosage} for {prescription.duration}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mb-4">No prescriptions added</p>
          )}

          <button
            onClick={handleAddPrescription}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Prescription
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <button
            onClick={handleCompleteVisit}
            disabled={visitCompleted}
            className={`px-6 py-3 rounded font-semibold ${
              visitCompleted
                ? 'bg-green-200 text-green-800 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {visitCompleted ? 'Visit Completed ✓' : 'Complete Visit'}
          </button>
        </div>
      </div>
    </div>
  );
}