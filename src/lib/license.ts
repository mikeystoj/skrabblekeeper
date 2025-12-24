import { v4 as uuidv4 } from 'uuid';
import { getSupabase } from './supabase';

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

// Store a license key in Supabase
export async function storeLicenseKey(
  licenseKey: string, 
  data: LicenseData
): Promise<void> {
  const supabase = getSupabase();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('licenses')
    .insert({
      license_key: licenseKey,
      email: data.email,
      stripe_payment_id: data.stripePaymentId,
      created_at: data.createdAt,
    });
    
  if (error) {
    console.error('Failed to store license:', error);
    throw new Error('Failed to store license key');
  }
}

// Validate a license key
export async function validateLicenseKey(licenseKey: string): Promise<LicenseData | null> {
  const supabase = getSupabase();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('licenses')
    .select('*')
    .eq('license_key', licenseKey)
    .single();
    
  if (error || !data) {
    return null;
  }
  
  return {
    email: data.email,
    createdAt: data.created_at,
    stripePaymentId: data.stripe_payment_id,
  };
}

// Get license key by email
export async function getLicenseByEmail(email: string): Promise<string | null> {
  const supabase = getSupabase();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('licenses')
    .select('license_key')
    .eq('email', email)
    .single();
    
  if (error || !data) {
    return null;
  }
  
  return data.license_key;
}
