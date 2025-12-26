import { NextRequest, NextResponse } from 'next/server';
import { getLicenseByEmail } from '@/lib/license';
import { sendLicenseEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Look up license by email
    const licenseKey = await getLicenseByEmail(email.toLowerCase());

    if (!licenseKey) {
      return NextResponse.json(
        { error: 'No license found for this email address' },
        { status: 404 }
      );
    }

    // Resend the license key email
    await sendLicenseEmail(email, licenseKey);

    return NextResponse.json({ 
      success: true,
      message: 'License key sent to your email'
    });
  } catch (error) {
    console.error('Resend license error:', error);
    return NextResponse.json(
      { error: 'Failed to resend license key' },
      { status: 500 }
    );
  }
}

