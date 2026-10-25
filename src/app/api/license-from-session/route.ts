import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getLicenseByPaymentId } from '@/lib/license';

// Lets the success page show the license key right after checkout.
// The checkout session ID is only known to the buyer (Stripe redirect URL).
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');

  if (!sessionId || !sessionId.startsWith('cs_')) {
    return NextResponse.json({ status: 'invalid' }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ status: 'unpaid' }, { status: 402 });
    }

    const paymentId = session.payment_intent as string;
    const licenseKey = paymentId ? await getLicenseByPaymentId(paymentId) : null;

    // The webhook may not have run yet; the page polls until it has
    if (!licenseKey) {
      return NextResponse.json({ status: 'pending' });
    }

    return NextResponse.json({
      status: 'ready',
      licenseKey,
      email: session.customer_email || session.metadata?.email || '',
    });
  } catch (error) {
    console.error('License lookup by session failed:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
