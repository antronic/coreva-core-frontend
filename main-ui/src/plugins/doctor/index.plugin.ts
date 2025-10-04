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
          }
        ]
      },
    ];

    console.log('✅ Route configuration complete. Routes object:', routes);
    console.log('🔍 Inspect route object:', JSON.stringify(routes, (_key, value) => {
      if (typeof value === 'function') return '[Function]';
      return value;
    }, 2));

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
      // TODO: Fix aftervisit slice
      // doctorAftervisit: (await import('./aftervisit/aftervisitSlice')).default,
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
  console.log('🔄 Loading doctor sagas...');
  // Temporarily disable sagas to focus on route loading
  console.log('⚠️ Sagas temporarily disabled for debugging');
  return [];
}

const plugin: PluginModule = { featureKey, getRoutes, getReducers, getSagas };
export default plugin;