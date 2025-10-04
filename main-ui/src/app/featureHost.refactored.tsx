// app/featureHost.tsx
import { useEffect, useState } from 'react';
import type { RouteObject } from 'react-router';
import { Outlet, useRoutes } from 'react-router';
import { fetchCapabilities } from '@/plugin-registry/capabilities';
import { pluginRegistry } from '@/plugin-registry';
import { store } from './store';
import { sagaManager } from './sagaManager';

export default function FeatureHost() {
  const [routes, setRoutes] = useState<RouteObject[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches tenant capabilities from API with fallback to mock data
   */
  const fetchTenantCapabilities = async (tenantId: string) => {
    try {
      const caps = await fetchCapabilities(tenantId);
      console.log('🏢 Loaded tenant capabilities:', caps);
      return caps;
    } catch (capError) {
      console.warn('⚠️ Failed to fetch capabilities, using mock:', capError);
      return { enabled: ['doctor'], plan: 'premium' }; // mock for development
    }
  };

  /**
   * Registers plugin reducers with the store
   */
  const registerPluginReducers = async (plugin: any) => {
    if (!plugin.getReducers) return;

    const reducers = await plugin.getReducers();
    Object.entries(reducers).forEach(([reducerKey, reducer]) => {
      (store as any).reducerManager.add(reducerKey, reducer);
    });
  };

  /**
   * Starts plugin sagas with the saga manager
   */
  const startPluginSagas = async (plugin: any) => {
    if (!plugin.getSagas) return;

    const sagas = await plugin.getSagas();
    sagas.forEach((saga: any, idx: number) => {
      const sagaKey = `${plugin.featureKey}_saga_${idx}`;
      sagaManager.run(sagaKey, saga);
    });
  };

  /**
   * Loads and initializes a single plugin
   */
  const loadPlugin = async (pluginKey: string): Promise<RouteObject[]> => {
    const pluginLoader = pluginRegistry[pluginKey];
    if (!pluginLoader) {
      console.warn(`❌ Plugin "${pluginKey}" not found in registry`);
      return [];
    }

    try {
      console.log(`📦 Loading plugin: ${pluginKey}`);
      const plugin = await pluginLoader();

      // Register plugin state and side effects
      await registerPluginReducers(plugin);
      await startPluginSagas(plugin);

      // Get plugin routes
      const routes = await plugin.getRoutes(`/${plugin.featureKey}`);
      console.log(`✅ Successfully loaded plugin: ${pluginKey}`);

      return routes;
    } catch (error) {
      console.error(`❌ Failed to load plugin "${pluginKey}":`, error);
      return [];
    }
  };

  /**
   * Loads all enabled plugins and returns their routes
   */
  const loadAllPlugins = async (enabledFeatures: string[]): Promise<RouteObject[]> => {
    const dynamicRoutes: RouteObject[] = [];

    for (const featureKey of enabledFeatures) {
      const pluginRoutes = await loadPlugin(featureKey);
      dynamicRoutes.push(...pluginRoutes);
    }

    console.log(`🚀 Loaded ${dynamicRoutes.length} plugin routes`);
    return dynamicRoutes;
  };

  /**
   * Creates the complete route configuration including static and dynamic routes
   */
  const createRouteConfiguration = (dynamicRoutes: RouteObject[]): RouteObject[] => {
    return [
      {
        path: '/',
        element: <Outlet />,
        children: [
          // Static routes (currently commented for FeatureHost-only usage)
          // { index: true, lazy: async () => {
          //   const Landing = await import('@/pages/Landing');
          //   return { Component: Landing.default }
          // } },
          // { path: 'login', lazy: async () => {
          //   const LoginPage = await import('@/pages/common/Login');
          //   return { Component: LoginPage.default}
          // } },

          // Mount dynamic plugin routes
          ...dynamicRoutes,

          // Error boundary
          // { path: '*', lazy: () => import('@/routes/errors/RootError') }
        ],
      },
    ];
  };

  /**
   * Main initialization function that orchestrates the plugin loading process
   */
  const initializeFeatures = async () => {
    try {
      setLoading(true);
      setError(null);

      const tenantId = 'current'; // derive from auth/session

      // Fetch capabilities and load plugins
      const capabilities = await fetchTenantCapabilities(tenantId);
      const dynamicRoutes = await loadAllPlugins(capabilities.enabled);

      // Create and set the final route configuration
      const routeConfig = createRouteConfiguration(dynamicRoutes);
      setRoutes(routeConfig);

      setLoading(false);
    } catch (err) {
      console.error('💥 Fatal error loading features:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setLoading(false);
    }
  };

  /**
   * Cleanup function to stop all sagas when component unmounts
   */
  const cleanupFeatures = () => {
    console.log('🧹 Cleaning up features...');
    sagaManager.cancelAll();
  };

  useEffect(() => {
    initializeFeatures();
    return cleanupFeatures;
  }, []);

  // Show loading or error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading features...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        <div>Error loading features: {error}</div>
      </div>
    );
  }

  const element = useRoutes(routes || [{ path: '/', element: <div /> }]);
  return element;
}