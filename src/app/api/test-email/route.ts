import { NextRequest, NextResponse } from 'next/server';
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

    // Generate a test license key
    const testLicenseKey = 'SK-TEST-1234-5678';

    console.log('Sending test email to:', email);

    const result = await sendLicenseEmail(email, testLicenseKey);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: `Test email sent to ${email}` 
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send test email' },
      { status: 500 }
    );
  }
}

