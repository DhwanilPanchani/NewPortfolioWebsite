import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Ensure Node.js runtime for SMTP
export const runtime = 'nodejs';

// Rate limiting store (in production, use Redis)
const rateLimitMap = new Map<string, number[]>();

function rateLimit(ip: string, limit: number = 5, window: number = 60000) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recentTimestamps = timestamps.filter((t) => now - t < window);

  if (recentTimestamps.length >= limit) {
    return false;
  }

  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Email sending is optional. If SMTP env vars are present, attempt to send.
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } =
      process.env as Record<string, string | undefined>;

    if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: Number(SMTP_PORT || 587),
          secure: Number(SMTP_PORT) === 465,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        });

        const toAddress = CONTACT_TO || SMTP_USER;
        const info = await transporter.sendMail({
          from: `Portfolio Contact <${SMTP_USER}>`,
          to: toAddress,
          replyTo: email,
          subject: `Portfolio Contact: ${name}`,
          text: `From: ${name} <${email}>\nIP: ${ip}\n\n${message}`,
        });
        console.log('Contact email sent:', info.messageId);
      } catch (sendError) {
        console.warn('SMTP configured but sending failed:', sendError);
        // Do not surface errors to the user; frontend shows success.
      }
    } else {
      // No SMTP configured; just log the message server-side and proceed.
      console.log('Contact submission:', { name, email, ip });
    }

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    // Always return success to align with frontend UX choice
    return NextResponse.json({ message: 'Message sent successfully!' }, { status: 200 });
  }
}