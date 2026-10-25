import { NextRequest, NextResponse } from 'next/server';
import { getStripe, PRICE_AMOUNT, CURRENCY } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: 'Skrabble Keeper Pro',
              description: 'Lifetime access to all Pro features',
              images: ['https://www.skrabblekeeper.com/icon-512.png'],
            },
            unit_amount: PRICE_AMOUNT,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/?canceled=true`,
      metadata: {
        email,
      },
      // Abandoned checkout recovery: Stripe emails a link back to checkout when the
      // session expires (needs "recovery emails" enabled in Stripe Dashboard > Settings > Checkout)
      after_expiration: {
        recovery: { enabled: true },
      },
      consent_collection: {
        promotions: 'auto',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

