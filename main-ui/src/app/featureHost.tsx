// app/featureHost.tsx
import { lazy, useEffect, useState } from 'react';
import type { RouteObject } from 'react-router';
import { Outlet, useRoutes } from 'react-router';
import { fetchCapabilities } from '@/plugin-registry/capabilities';
import { pluginRegistry } from '@/plugin-registry';
import { store } from './store';
import { sagaManager } from './sagaManager';

export default function FeatureHost() {
  const [routes, setRoutes] = useState<RouteObject[] | null>(null);

  /**
   * Fetches tenant capabilities from API
   */
  const fetchTenantCapabilities = async (tenantId: string) => {
    const caps = await fetchCapabilities(tenantId);
    console.log('🏢 Loaded tenant capabilities:', caps);
    return caps;
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
   * Runs plugin initialization functions after reducers are loaded
   */
  const runPluginInitializers = async (plugin: any) => {
    if (!plugin.getInitializers) return;

    try {
      const initializers = await plugin.getInitializers();
      console.log(`🚀 Running ${initializers.length} initializers for ${plugin.featureKey}`);
      
      // Run all initializers
      initializers.forEach((initializer: () => void, index: number) => {
        try {
          initializer();
          console.log(`✅ Initializer ${index + 1} completed for ${plugin.featureKey}`);
        } catch (error) {
          console.error(`❌ Initializer ${index + 1} failed for ${plugin.featureKey}:`, error);
        }
      });
    } catch (error) {
      console.error(`❌ Failed to run initializers for ${plugin.featureKey}:`, error);
    }
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
      
      // Run plugin initializers after reducers and sagas are set up
      await runPluginInitializers(plugin);

      // Get plugin routes
      const routes = await plugin.getRoutes(`/${plugin.featureKey}`);
      console.log(`✅ Successfully loaded plugin: ${pluginKey}`);
      console.log(`🗺️ Plugin routes received:`, routes.length, 'routes');
      console.log(`🔍 Route details:`, routes.map(r => ({
        path: r.path,
        hasLazy: !!r.lazy,
        hasComponent: !!r.Component
      })));

      return routes;
    } catch (error) {
      console.error(`❌ Failed to load plugin "${pluginKey}":`, error);
      return [];
    }
  };

  /**
   * Loads all enabled plugins and returns their combined routes
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
    console.log('🏗️ Creating final route configuration with', dynamicRoutes.length, 'dynamic routes');
    console.log('🔍 Dynamic routes summary:', dynamicRoutes.map(r => r.path));

    const finalConfig = [
      {
        path: '/',
        element: <Outlet/>,
        children: [
          // Static routes (commented for plugin-only setup)
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
        ]
      },
    ];

    console.log('✅ Final route configuration created');
    return finalConfig;
  };

  /**
   * Main initialization function that orchestrates the plugin loading process
   */
  const initializeFeatures = async () => {
    try {
      const tenantId = 'current'; // derive from auth/session

      // Fetch capabilities and load plugins
      const capabilities = await fetchTenantCapabilities(tenantId);
      const dynamicRoutes = await loadAllPlugins(capabilities.enabled);

      // Create and set the final route configuration
      const routeConfig = createRouteConfiguration(dynamicRoutes);
      setRoutes(routeConfig);

    } catch (error) {
      console.error('💥 Fatal error loading features:', error);
      // Set minimal fallback routes
      setRoutes([{ path: '/', element: <div>Error loading features</div> }]);
    }
  };

  useEffect(() => {
    initializeFeatures();
  }, []);

  // Always call useRoutes hook before conditional rendering
  const element = useRoutes(routes || [{ path: '/', element: <div /> }]);
  return element;
}