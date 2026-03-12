import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Check if API key is configured
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Email service not configured. Please contact directly via social media.' },
        { status: 503 }
      );
    }

    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const { name, email, message } = await req.json();

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'adebisireuel@gmail.com',
      replyTo: email,
      subject: `New Portfolio Contact from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #050505; color: #e2e8f0; padding: 24px; border: 1px solid rgba(255, 255, 255, 0.08);">
            <div style="margin-bottom: 24px;">
              <h2 style="color: #00ffc2; margin: 0 0 16px 0;">New Contact from Jethro.codes Portfolio</h2>
              <p style="margin: 0; color: #9ca3af; font-size: 14px;">Someone reached out through your portfolio website</p>
            </div>

            <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 16px; margin-bottom: 16px;">
              <p style="margin: 0 0 12px 0;"><strong style="color: #00ffc2;">From:</strong> ${name}</p>
              <p style="margin: 0 0 12px 0;"><strong style="color: #00ffc2;">Email:</strong> <a href="mailto:${email}" style="color: #00ffc2; text-decoration: none;">${email}</a></p>
              <p style="margin: 12px 0; color: #9ca3af; font-size: 13px;">Reply-To: ${email}</p>
            </div>

            <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 16px; margin-bottom: 24px;">
              <h3 style="color: #e2e8f0; margin: 0 0 12px 0;">Message:</h3>
              <p style="margin: 0; white-space: pre-wrap; color: #d1d5db; line-height: 1.6;">${message}</p>
            </div>

            <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 16px; text-align: center; font-size: 12px; color: #6b7280;">
              <p style="margin: 0;">Sent from your portfolio website • jethro.codes</p>
            </div>
          </div>
        </div>
      `,
    });

    if (result.error) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
