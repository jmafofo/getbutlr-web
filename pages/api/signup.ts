import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const HONEYPOT_SECRET = process.env.HONEYPOT_SECRET || 'butlr-secret-key';
const RATE_LIMIT_SECONDS = 10; // basic rate limiting (per IP)

const ipRateLimitMap = new Map<string, number>();

const emailTemplate = (recipient: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9fbfd; color: #333;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://getbutlr.ai/logo-dark.png" alt="Butlr Logo" style="width: 120px;" />
    </div>
    <h2 style="color: #0e2b5c">Welcome to Butlr, ${recipient.split('@')[0]}!</h2>
    <p>We're thrilled to have you on board. 🚀</p>
    <p>Butlr is your AI-powered co-pilot for growing fast and smart on YouTube and beyond.</p>
    <ul>
      <li>💡 Optimize titles and thumbnails</li>
      <li>📈 Track your video performance</li>
      <li>📣 Get discovered with AI promotions</li>
    </ul>
    <p>We’ll keep you updated with product drops, creator case studies, and exclusive tools.</p>
    <p>Stay tuned, and happy creating!<br />– The Butlr Team</p>
    <hr style="margin: 30px 0;" />
    <p style="font-size: 12px; color: #777">
      You received this email because you signed up on <strong>getbutlr.ai</strong>.<br/>
      <a href="https://getbutlr.ai/preferences" style="color: #0e2b5c;">Manage Preferences</a> ·
      <a href="https://getbutlr.ai/unsubscribe" style="color: #0e2b5c;">Unsubscribe</a>
    </p>
  </div>
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, honeypot } = req.body;

  // 🛡️ Spam: honeypot field must be blank
  if (honeypot && honeypot !== '') {
    return res.status(400).json({ error: 'Bot detection triggered' });
  }

  // 🛡️ Spam: rate limiting by IP
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  const last = ipRateLimitMap.get(ip as string) || 0;
  if (now - last < RATE_LIMIT_SECONDS * 1000) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  ipRateLimitMap.set(ip as string, now);

  // 📧 Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // ✅ Save to Supabase
  const { error } = await supabase.from('signups').insert([{ email }]);
  if (error) return res.status(500).json({ error: error.message });

  // ✉️ Send welcome email via Resend (with HTML styling)
  try {
    await resend.emails.send({
      from: 'welcome@getbutlr.ai',
      to: email,
      subject: 'Welcome to Butlr! 🎉',
      html: emailTemplate(email)
    });
  } catch (emailErr) {
    console.warn('Email send failed:', emailErr);
  }

  return res.status(200).json({ message: 'Signup successful' });
}

