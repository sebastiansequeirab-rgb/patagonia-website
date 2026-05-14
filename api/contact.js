// Vercel Serverless Function: receives contact-form submissions and forwards them
// as email through Resend (https://resend.com).
//
// Required environment variables on Vercel for live email delivery:
//   RESEND_API_KEY      — API key from https://resend.com/api-keys
//   CONTACT_TO_EMAIL    — recipient address (defaults to info@patagoniaamericas.com)
//   CONTACT_FROM_EMAIL  — sender, must use a domain verified in Resend
//                          (defaults to onboarding@resend.dev for first-deploy testing)
//
// Without RESEND_API_KEY set the endpoint still returns 200 so the front-end UX
// works, but the inquiry is only logged to Vercel function logs. That lets you
// deploy first and wire the email later.

const SUBJECT_LABELS = {
  sourcing: 'Product Sourcing',
  supply: 'Ongoing Supply Agreement',
  logistics: 'Logistics & Shipping',
  partnership: 'Partnership Opportunity',
  press: 'Press / Media',
  other: 'General Inquiry'
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const name = String(body.name || '').trim();
  const company = String(body.company || '').trim();
  const email = String(body.email || '').trim();
  const subjectKey = String(body.subject || '').trim();
  const message = String(body.message || '').trim();

  if (!name || !company || !email || !subjectKey || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  if (message.length > 8000) {
    return res.status(400).json({ error: 'Message too long' });
  }

  const subjectLabel = SUBJECT_LABELS[subjectKey] || subjectKey;
  const to = process.env.CONTACT_TO_EMAIL || 'info@patagoniaamericas.com';
  const from = process.env.CONTACT_FROM_EMAIL || 'Patagonia Americas <onboarding@resend.dev>';
  const apiKey = process.env.RESEND_API_KEY;

  const emailSubject = `New inquiry: ${subjectLabel} from ${company}`;
  const text =
    `New inquiry from the Patagonia Americas website\n\n` +
    `Name: ${name}\n` +
    `Company: ${company}\n` +
    `Email: ${email}\n` +
    `Reason: ${subjectLabel}\n\n` +
    message;
  const html = `
    <h2 style="font-family: Georgia, serif; color: #0f2922; margin: 0 0 12px;">New inquiry from the Patagonia Americas website</h2>
    <table style="font-family: -apple-system, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #0c1614; border-collapse: collapse;">
      <tr><td style="padding: 4px 18px 4px 0;"><strong>Name</strong></td><td>${esc(name)}</td></tr>
      <tr><td style="padding: 4px 18px 4px 0;"><strong>Company</strong></td><td>${esc(company)}</td></tr>
      <tr><td style="padding: 4px 18px 4px 0;"><strong>Email</strong></td><td><a href="mailto:${esc(email)}" style="color: #b8954a;">${esc(email)}</a></td></tr>
      <tr><td style="padding: 4px 18px 4px 0;"><strong>Reason</strong></td><td>${esc(subjectLabel)}</td></tr>
    </table>
    <hr style="border: none; border-top: 1px solid #e8e1d2; margin: 20px 0;">
    <p style="white-space: pre-wrap; font-family: -apple-system, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #0c1614; margin: 0;">${esc(message)}</p>
  `;

  if (!apiKey) {
    console.warn('[contact] RESEND_API_KEY not set; inquiry received but not emailed.');
    console.log('[contact] Inquiry:', JSON.stringify({ name, company, email, subject: subjectLabel }));
    return res.status(200).json({ ok: true, delivered: false });
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: emailSubject,
        html,
        text
      })
    });
    if (!r.ok) {
      const detail = await r.text();
      console.error('[contact] Resend responded', r.status, detail);
      return res.status(502).json({ error: 'Email delivery failed' });
    }
  } catch (err) {
    console.error('[contact] Network error contacting Resend:', err);
    return res.status(502).json({ error: 'Email delivery failed' });
  }

  return res.status(200).json({ ok: true, delivered: true });
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
