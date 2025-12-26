import { NextRequest, NextResponse } from 'next/server';
import { getLicenseByEmail } from '@/lib/license';
import { sendLicenseEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    console.log('Resend license request for email:', email);

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Look up license by email (try lowercase)
    const normalizedEmail = email.toLowerCase().trim();
    console.log('Looking up license for:', normalizedEmail);
    
    const licenseKey = await getLicenseByEmail(normalizedEmail);
    console.log('License key found:', licenseKey);

    if (!licenseKey) {
      console.log('No license found for email:', normalizedEmail);
      return NextResponse.json(
        { error: 'No license found for this email address' },
        { status: 404 }
      );
    }

    // Resend the license key email
    console.log('Sending email with license key:', licenseKey);
    const emailResult = await sendLicenseEmail(email, licenseKey);
    console.log('Email send result:', emailResult);

    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error || 'Failed to send email' },
        { status: 500 }
      );
    }

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

