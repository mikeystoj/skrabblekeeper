import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';

export interface LicenseData {
  email: string;
  createdAt: string;
  stripePaymentId: string;
}

// Generate a unique license key
export function generateLicenseKey(): string {
  // Format: SK-XXXX-XXXX-XXXX (easy to read and type)
  const uuid = uuidv4().replace(/-/g, '').toUpperCase();
  return `SK-${uuid.slice(0, 4)}-${uuid.slice(4, 8)}-${uuid.slice(8, 12)}`;
}

// Store a license key in Vercel KV
export async function storeLicenseKey(
  licenseKey: string, 
  data: LicenseData
): Promise<void> {
  await kv.set(`license:${licenseKey}`, JSON.stringify(data));
  // Also store by email for lookup
  await kv.set(`email:${data.email}`, licenseKey);
}

// Validate a license key
export async function validateLicenseKey(licenseKey: string): Promise<LicenseData | null> {
  const data = await kv.get<string>(`license:${licenseKey}`);
  if (!data) return null;
  return typeof data === 'string' ? JSON.parse(data) : data;
}

// Get license key by email
export async function getLicenseByEmail(email: string): Promise<string | null> {
  return await kv.get<string>(`email:${email}`);
}

