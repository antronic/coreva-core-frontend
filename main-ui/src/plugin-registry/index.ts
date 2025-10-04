// plugin-registry/index.ts
import type { RouteObject } from 'react-router';
import type { Reducer } from '@reduxjs/toolkit';

export type PluginModule = {
  featureKey: string;
  getRoutes: (basePath: string) => Promise<RouteObject[]>; // created with lazy() inside
  getReducers?: () => Promise<Record<string, Reducer>>;
  getSagas?: () => Promise<(() => Generator)[]>;
  getInitializers?: () => Promise<(() => void)[]>; // Functions to initialize plugin state
};

// IMPORTANT: each value is a dynamic import -> separate chunk per feature
export const pluginRegistry: Record<string, () => Promise<PluginModule>> = {
  doctor: () => import('@/plugins/doctor/index.plugin'),
  // billing: () => import('@/plugins/billing/index.plugin'),
  // inventory: () => import('@/plugins/inventory/index.plugin'),
};