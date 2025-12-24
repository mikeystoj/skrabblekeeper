import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { generateLicenseKey, storeLicenseKey } from '@/lib/license';
import { sendLicenseEmail } from '@/lib/email';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const email = session.customer_email || session.metadata?.email;
    
    if (!email) {
      console.error('No email found in session');
      return NextResponse.json(
        { error: 'No email found' },
        { status: 400 }
      );
    }

    // Generate license key
    const licenseKey = generateLicenseKey();

    // Store in Vercel KV
    await storeLicenseKey(licenseKey, {
      email,
      createdAt: new Date().toISOString(),
      stripePaymentId: session.payment_intent as string,
    });

    // Send email with license key
    const emailResult = await sendLicenseEmail(email, licenseKey);
    
    if (!emailResult.success) {
      console.error('Failed to send license email:', emailResult.error);
      // Don't fail the webhook - the license is still stored
    }

    console.log(`License key generated for ${email}: ${licenseKey}`);
  }

  return NextResponse.json({ received: true });
}

