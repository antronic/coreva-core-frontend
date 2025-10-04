// Doctor Layout component
import { Outlet, Link, useParams } from 'react-router';
import { useSelector } from 'react-redux';

export default function DoctorLayout() {
  const { visitId } = useParams();
  const { activePatient, currentVisit } = useSelector((state: any) => state.doctorCore || {});

  console.log('Doctor Layout - visitId:', visitId, 'activePatient:', activePatient, 'currentVisit:', currentVisit);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Doctor Workflow</h1>
              {activePatient && (
                <p className="text-sm text-gray-600">
                  Patient: {activePatient.name} | Visit ID: {visitId}
                </p>
              )}
            </div>

            {currentVisit && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentVisit.status === 'in-progress' ? 'bg-green-100 text-green-800' :
                currentVisit.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {currentVisit.status}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to={`/doctor/${visitId}/in-chair`}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
                >
                  📋 In-Chair Procedures
                </Link>
              </li>
              <li>
                <Link
                  to={`/doctor/${visitId}/after-visit`}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gay-100 hover:text-gray-900"
                >
                  📝 Post-Visit Documentation
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}