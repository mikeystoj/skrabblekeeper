import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { generateLicenseKey, storeLicenseKey } from '@/lib/license';
import { sendLicenseEmail } from '@/lib/email';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  console.log('Webhook received');
  
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
    console.error('No signature provided');
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('Webhook event verified:', event.type);
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
    console.log('Processing checkout for email:', email);
    
    if (!email) {
      console.error('No email found in session');
      return NextResponse.json(
        { error: 'No email found' },
        { status: 400 }
      );
    }

    // Generate license key
    const licenseKey = generateLicenseKey();
    console.log('Generated license key:', licenseKey);

    // Store in Supabase
    try {
      await storeLicenseKey(licenseKey, {
        email,
        createdAt: new Date().toISOString(),
        stripePaymentId: session.payment_intent as string,
      });
      console.log('License stored in Supabase successfully');
    } catch (error) {
      console.error('Failed to store license in Supabase:', error);
      return NextResponse.json(
        { error: 'Failed to store license' },
        { status: 500 }
      );
    }

    // Send email with license key
    try {
      const emailResult = await sendLicenseEmail(email, licenseKey);
      
      if (!emailResult.success) {
        console.error('Failed to send license email:', emailResult.error);
      } else {
        console.log('License email sent successfully');
      }
    } catch (error) {
      console.error('Email sending threw error:', error);
    }

    console.log(`License key generated for ${email}: ${licenseKey}`);
  }

  return NextResponse.json({ received: true });
}
