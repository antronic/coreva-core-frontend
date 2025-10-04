// plugins/doctor/core/visitGuard.loader.ts
import { capabilityGuard } from '@/plugin-registry/guards';
export async function loader({ params }: any) {
  await capabilityGuard('doctor');
  // optionally pre-dispatch bootstrapStarted({ visitId: params.visitId })
  return null;
}