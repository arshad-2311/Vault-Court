import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.RESEND_API_KEY || '';
const resend = new Resend(apiKey);

async function testSend() {
  console.log('Sending test email via Resend to beastboy231128@gmail.com...');
  try {
    const res = await resend.emails.send({
      from: 'VAULT 147 <onboarding@resend.dev>',
      to: 'beastboy231128@gmail.com',
      subject: '🎟️ VAULT 147 — Resend Live Test Connection',
      html: `
        <div style="background:#09090c;color:#ffffff;padding:24px;font-family:sans-serif;border:1px solid #d97706;border-radius:8px;">
          <h2 style="color:#fbbf24;margin-top:0;">⚡ VAULT 147 LIVE RESEND INTEGRATION VERIFIED</h2>
          <p style="color:#d1d5db;font-size:14px;line-height:1.6;">
            Your Resend API Key is <strong>100% active and functioning</strong>!
          </p>
          <div style="background:#1e1a12;border-left:4px solid #f59e0b;padding:12px;margin:16px 0;">
            <strong style="color:#fbbf24;">Status:</strong> Live delivery active on local environment.<br/>
            <strong style="color:#fbbf24;">Sender:</strong> VAULT 147 &lt;onboarding@resend.dev&gt;<br/>
            <strong style="color:#fbbf24;">Recipient:</strong> beastboy231128@gmail.com
          </div>
          <p style="color:#9ca3af;font-size:12px;">VAULT 147 · Mannarsamy 6/1, Royapuram, Chennai</p>
        </div>
      `
    });

    console.log('Result:', JSON.stringify(res, null, 2));
    if (res.data?.id) {
      console.log(`\n🎉 SUCCESS! Email dispatched with ID: ${res.data.id}`);
      console.log('Please check your inbox at beastboy231128@gmail.com.');
    }
  } catch (err) {
    console.error('Test Send failed:', err);
  }
}

testSend();
