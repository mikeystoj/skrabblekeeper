import { NextRequest, NextResponse } from 'next/server';
import { validateLicenseKey } from '@/lib/license';

export async function POST(request: NextRequest) {
  try {
    const { licenseKey } = await request.json();

    if (!licenseKey || typeof licenseKey !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'License key is required' },
        { status: 400 }
      );
    }

    // Normalize the license key (uppercase, trim)
    const normalizedKey = licenseKey.trim().toUpperCase();

    const licenseData = await validateLicenseKey(normalizedKey);

    if (licenseData) {
      return NextResponse.json({
        valid: true,
        email: licenseData.email,
        activatedAt: licenseData.createdAt,
      });
    }

    return NextResponse.json({
      valid: false,
      error: 'Invalid license key',
    });
  } catch (error) {
    console.error('License validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate license' },
      { status: 500 }
    );
  }
}

