import { Resend } from 'resend';

// Lazy initialization - only create Resend instance when needed
let resendClient: Resend | null = null;

const getResendClient = (): Resend => {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured in environment variables');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
};

interface SendPasswordResetEmailParams {
  to: string;
  name: string;
  resetToken: string;
}

export const sendPasswordResetEmail = async ({
  to,
  name,
  resetToken,
}: SendPasswordResetEmailParams): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const resend = getResendClient();

  try {
    const result = await resend.emails.send({
      from: 'VeilVogue <onboarding@resend.dev>',
      to,
      subject: 'Reset Your Password - VeilVogue',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #000000; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">VeilVogue</h1>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Reset Your Password</h2>
                        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                          Hi ${name},
                        </p>
                        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                          We received a request to reset your password for your VeilVogue account. Click the button below to create a new password:
                        </p>

                        <!-- Button -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="${resetUrl}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 4px; font-size: 16px; font-weight: bold;">
                                Reset Password
                              </a>
                            </td>
                          </tr>
                        </table>

                        <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                          Or copy and paste this link into your browser:
                        </p>
                        <p style="color: #0066cc; font-size: 14px; word-break: break-all; margin: 10px 0 20px 0;">
                          ${resetUrl}
                        </p>

                        <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #eeeeee;">
                          <strong>Important:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center;">
                        <p style="color: #999999; font-size: 12px; margin: 0;">
                          © ${new Date().getFullYear()} VeilVogue. All rights reserved.
                        </p>
                        <p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">
                          Premium Modest Fashion for Women
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    console.log('✅ Resend API Response:', JSON.stringify(result, null, 2));
    console.log(`📧 Password reset email sent to ${to}`);

    if (result.error) {
      console.error('❌ Resend API Error:', result.error);
      throw new Error(`Resend API Error: ${JSON.stringify(result.error)}`);
    }
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};
