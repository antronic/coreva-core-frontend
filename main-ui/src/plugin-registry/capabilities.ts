// types
export type FeatureKey = 'doctor' | 'billing' | 'inventory';
export type TenantCapabilities = { enabled: FeatureKey[]; plan: string; };

export const fakeFetchCapabilities = async (): Promise<TenantCapabilities> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ enabled: ['doctor', 'billing'], plan: 'premium' });
    }, 500);
  });
}

// fetch at boot
export async function _fetchCapabilities(tenantId: string): Promise<TenantCapabilities> {
  const res = await fetch(`/api/tenants/${tenantId}/capabilities`, { credentials: 'include' });
  return res.json();
}

export const fetchCapabilities = import.meta.env.MODE !== 'production' ? fakeFetchCapabilities : _fetchCapabilities;