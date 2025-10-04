// plugins/doctor/index.plugin.ts
import React, { lazy } from 'react';
import type { PluginModule } from '@/plugin-registry';
import type { RouteObject } from 'react-router';
// Remove direct import to test lazy loading
// import DoctorLayout from './ui/DoctorLayout'

const VisitGuardLoader = (await import('./core/visitGuard.loader')).loader;

const DoctorLayout = lazy(() => import('./ui/DoctorLayout'))

export const featureKey = 'doctor';

export async function getRoutes(basePath: string): Promise<RouteObject[]> {
  console.log('🔗 Setting up doctor routes with basePath:', basePath);

  const InChair = lazy(() => import('./inchair/pages/index'))

  try {
    // Add a simple test route first
    const routes = [
      {
        path: `${basePath}/:visitId`,
        // Test: Try ONLY lazy loading (Component commented out)
        loader: VisitGuardLoader,
        Component: DoctorLayout,
        children: [
          {
            path: 'in-chair',
            loader: VisitGuardLoader,
            Component: InChair,
          },
          {
            path: 'after-visit',
            loader: VisitGuardLoader,
            Component: lazy(() => import('./aftervisit/pages/index')),
          },
        ]
      },
    ];

    return routes;
  } catch (error) {
    throw error;
  }
}

export async function getReducers() {
  console.log('📊 Loading doctor reducers...');
  try {
    const reducers = {
      doctorCore: (await import('./core/doctorSlice')).default,
      doctorInchair: (await import('./inchair/inchairSlice')).default,
      doctorAftervisit: (await import('./aftervisit/aftervisitSlice')).default,
    };
    console.log('✅ Successfully loaded reducers');
    return reducers;
  } catch (error) {
    console.error('❌ Error loading reducers:', error);
    // Return minimal reducers to prevent total failure
    return {
      doctorCore: (await import('./core/doctorSlice')).default,
    };
  }
}

export async function getSagas() {
  // console.log('🔄 Loading doctor sagas...');
  // // Temporarily disable sagas to focus on route loading
  // console.log('⚠️ Sagas temporarily disabled for debugging');
  return [];
}

export async function getInitializers() {
  console.log('🔧 Loading doctor initializers...');

  // Import store and action creators dynamically
  const { store } = await import('@/app/store');

  const initializers = [
    // Initialize core doctor state
    async () => {
      console.log('🩺 Initializing doctor core state...');
      const { setLoading, setDoctor } = await import('./core/doctorSlice');

      // Set loading to false and initialize with default doctor
      store.dispatch(setLoading(false));

      // Example: Load current doctor from localStorage or API
      const savedDoctor = localStorage.getItem('currentDoctor');
      if (savedDoctor) {
        try {
          const doctor = JSON.parse(savedDoctor);
          store.dispatch(setDoctor(doctor));
          console.log('✅ Restored doctor from localStorage:', doctor.name);
        } catch (error) {
          console.warn('⚠️ Failed to parse saved doctor data');
        }
      }
    },

    // Initialize inchair state
    async () => {
      console.log('🪑 Initializing inchair state...');
      const { addNote, setProcedureSteps } = await import('./inchair/inchairSlice');

      // Example: Add initial welcome note
      store.dispatch(addNote('Session started - Ready for procedures'));

      // Set up default procedure steps template
      const defaultSteps = [
        { id: '1', name: 'Patient check-in', completed: false, duration: 5 },
        { id: '2', name: 'Initial examination', completed: false, duration: 15 },
        { id: '3', name: 'Treatment procedure', completed: false, duration: 30 },
        { id: '4', name: 'Post-treatment review', completed: false, duration: 10 },
        { id: '5', name: 'Schedule follow-up', completed: false, duration: 5 },
      ];
      store.dispatch(setProcedureSteps(defaultSteps));

      // Example: Restore any incomplete procedures from localStorage
      const savedProcedure = localStorage.getItem('currentProcedure');
      if (savedProcedure) {
        const { startProcedure } = await import('./inchair/inchairSlice');
        store.dispatch(startProcedure(savedProcedure));
        console.log('✅ Restored incomplete procedure:', savedProcedure);
      }
    },

    // Initialize aftervisit state
    async () => {
      console.log('📝 Initializing aftervisit state...');
      const { updateSummaryNotes } = await import('./aftervisit/aftervisitSlice');

      // Example: Load template summary notes
      const templateNotes = localStorage.getItem('summaryTemplate') || 'Visit completed successfully.';
      store.dispatch(updateSummaryNotes(templateNotes));
    },

    // Load any persisted data from localStorage or API
    async () => {
      console.log('💾 Loading persisted doctor data...');

      // Example: Restore current visit if exists
      const currentVisitId = localStorage.getItem('currentVisitId');
      if (currentVisitId) {
        const { setCurrentVisit, setActivePatient } = await import('./core/doctorSlice');

        // Mock loading visit data (in real app, this would be an API call)
        const mockVisit = {
          id: currentVisitId,
          patientId: 'patient-123',
          doctorId: 'doctor-456',
          date: new Date().toISOString(),
          status: 'in-progress' as const
        };

        const mockPatient = {
          id: 'patient-123',
          name: 'John Doe',
          dob: '1988-01-15',
          lastVisit: new Date().toISOString()
        };

        store.dispatch(setCurrentVisit(mockVisit));
        store.dispatch(setActivePatient(mockPatient));
        console.log('✅ Restored current visit:', currentVisitId);
      }
    }
  ];

  return initializers;
}

const plugin: PluginModule = { featureKey, getRoutes, getReducers, getSagas, getInitializers };
export default plugin;