import { Resend } from 'resend';

// Initialize Resend only when needed (not during build)
let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

export async function sendLicenseEmail(
  email: string, 
  licenseKey: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResend();
    await resend.emails.send({
      from: 'Skrabble Keeper <noreply@skrabblekeeper.com>',
      to: email,
      subject: 'Your Skrabble Keeper Pro License Key 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f0e8; margin: 0; padding: 20px;">
          <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: #1e3a5f; padding: 30px; text-align: center;">
              <h1 style="color: #f5f0e8; margin: 0; font-size: 24px;">Skrabble Keeper Pro</h1>
              <p style="color: #f5f0e8; opacity: 0.8; margin: 10px 0 0 0;">Thank you for your purchase!</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <p style="color: #1e3a5f; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Your Pro license key is ready. Enter this key in the app to unlock all Pro features.
              </p>
              
              <!-- License Key Box -->
              <div style="background: #f5f0e8; border: 2px dashed #1e3a5f; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                <p style="color: #1e3a5f; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your License Key</p>
                <p style="color: #1e3a5f; font-size: 24px; font-weight: bold; margin: 0; font-family: monospace; letter-spacing: 2px;">
                  ${licenseKey}
                </p>
              </div>
              
              <p style="color: #1e3a5f; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                <strong>How to activate:</strong><br>
                1. Open Skrabble Keeper<br>
                2. Click "Keeper Pro"<br>
                3. Enter your license key<br>
                4. Enjoy Pro features!
              </p>
              
              <!-- Pro Features -->
              <div style="background: #f5f0e8; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="color: #1e3a5f; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">Pro Features Included:</p>
                <ul style="color: #1e3a5f; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Dictionary validation</li>
                  <li>Game history & stats</li>
                  <li>Predictive word helper</li>
                  <li>Word lookup</li>
                  <li>Multi-lingual support</li>
                  <li>Turn timer</li>
                </ul>
              </div>
              
              <p style="color: #1e3a5f; opacity: 0.6; font-size: 12px; margin: 20px 0 0 0;">
                Keep this email safe - you'll need this key if you switch devices.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f5f0e8; padding: 20px; text-align: center;">
              <p style="color: #1e3a5f; opacity: 0.6; font-size: 12px; margin: 0;">
                Questions? Reply to this email.<br>
                © ${new Date().getFullYear()} Skrabble Keeper
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}

