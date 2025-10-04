// plugin-registry/guards.ts
import { redirect } from 'react-router';
import { fetchCapabilities } from './capabilities';

export async function capabilityGuard(required: string) {
  const caps = await fetchCapabilities('current');
  if (!caps.enabled.includes(required as any)) {
    throw redirect('/'); // or to /upgrade
  }
  return null;
}