// Vercel Serverless Function — receives contact-form submissions and sends email
// through the official Resend SDK (https://resend.com).
//
// Environment variables (Vercel → Settings → Environment Variables, and .env for
// local `vercel dev`):
//   RESEND_API_KEY      — API key from https://resend.com/api-keys   (REQUIRED)
//   CONTACT_FROM_EMAIL  — sender; must use a Resend-verified domain. Defaults to
//                         the shared test sender onboarding@resend.dev.
//   CONTACT_TO_EMAIL    — company inbox. Defaults to Exports@patagoniaamericas.com.
//
// Behaviour: sends TWO emails per submission —
//   1) a confirmation to the visitor's address (reply-to = company), and
//   2) a lead notification to the company inbox (reply-to = visitor).
// They're dispatched with Promise.allSettled, so one failing (e.g. Resend test
// mode only delivering to the account owner) doesn't block the other.

import { Resend } from 'resend';

const SUBJECT_LABELS = {
  sourcing: 'Sourcing & Procurement',
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
  const phone = String(body.phone || '').trim();
  const subjectKey = String(body.subject || '').trim();
  const message = String(body.message || '').trim();

  // name, email and message are required; company / phone / subject are optional.
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  if (message.length > 8000) {
    return res.status(400).json({ error: 'Message too long' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set.');
    return res.status(500).json({ error: 'Email service is not configured' });
  }

  const from = process.env.CONTACT_FROM_EMAIL || 'Patagonia Americas <onboarding@resend.dev>';
  const company_inbox = process.env.CONTACT_TO_EMAIL || 'Exports@patagoniaamericas.com';
  const subjectLabel = SUBJECT_LABELS[subjectKey] || subjectKey || 'General Inquiry';

  // Shared table of the submitted fields (only rows that have a value).
  const fields = [
    ['Name', name],
    ['Company', company],
    ['Email', email],
    ['Phone', phone],
    ['Reason', subjectLabel]
  ].filter(([, v]) => v);

  const rowsHtml = fields.map(([label, value]) => `
      <tr>
        <td style="padding:8px 20px 8px 0;font-weight:600;color:#1F2D24;white-space:nowrap;vertical-align:top;">${esc(label)}</td>
        <td style="padding:8px 0;color:#1A1F1A;">${esc(value)}</td>
      </tr>`).join('');
  const fieldsText = fields.map(([label, value]) => `${label}: ${value}`).join('\n');

  // 1) Confirmation email — sent to the visitor.
  const visitorHtml = shell(
    `Thank you, ${esc(name)}.`,
    `We received your inquiry and our trading desk will be in touch shortly. For your records, here is a copy of what you submitted:`,
    rowsHtml, message
  );
  const visitorText =
    `Thank you, ${name}.\n\nWe received your inquiry and our trading desk will be in touch shortly.\n` +
    `Here is a copy of what you submitted:\n\n${fieldsText}\n\nMessage:\n${message}\n\n` +
    `— Patagonia Americas LLC · 300 SE 2nd Street, Suite 600, Fort Lauderdale, FL 33301, USA`;

  // 2) Lead notification — sent to the company inbox.
  const companyHtml = shell(
    `New inquiry from ${esc(name)}.`,
    `A new contact-form submission came in through the website:`,
    rowsHtml, message
  );
  const companyText =
    `New inquiry from the Patagonia Americas website\n\n${fieldsText}\n\nMessage:\n${message}`;

  const resend = new Resend(apiKey);
  const [toVisitor, toCompany] = await Promise.allSettled([
    resend.emails.send({
      from,
      to: email,
      replyTo: company_inbox,
      subject: `Patagonia Americas — we received your inquiry, ${name}`,
      html: visitorHtml,
      text: visitorText
    }),
    resend.emails.send({
      from,
      to: company_inbox,
      replyTo: email,
      subject: `New inquiry: ${subjectLabel} from ${company || name}`,
      html: companyHtml,
      text: companyText
    })
  ]);

  const ok = (r) => r.status === 'fulfilled' && !r.value?.error;
  const visitorOk = ok(toVisitor);
  const companyOk = ok(toCompany);

  if (!visitorOk) console.error('[contact] visitor send failed:', toVisitor.reason || toVisitor.value?.error);
  if (!companyOk) console.error('[contact] company send failed:', toCompany.reason || toCompany.value?.error);

  // Succeed if at least one email went out (in Resend test mode only the account
  // owner's address is deliverable, so one leg may fail until a domain is verified).
  if (!visitorOk && !companyOk) {
    return res.status(502).json({ error: 'Email delivery failed' });
  }
  return res.status(200).json({ ok: true, delivered: { visitor: visitorOk, company: companyOk } });
}

// Branded email shell: inline styles + table, values injected by the caller.
function shell(heading, intro, rowsHtml, message) {
  return `
  <div style="margin:0;padding:24px;background:#FAF5E8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #E2DAC4;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="background:#1F2D24;padding:28px 32px;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:0.14em;color:#F5EDD8;text-transform:uppercase;">PATAGONIA</div>
          <div style="font-size:10px;letter-spacing:0.34em;color:#C8A865;text-transform:uppercase;margin-top:4px;">Americas LLC</div>
        </td>
      </tr>
      <tr>
        <td style="padding:32px;">
          <h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:24px;color:#1F2D24;">${heading}</h1>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.65;color:#4A5248;">${intro}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6;border-top:1px solid #E2DAC4;border-bottom:1px solid #E2DAC4;">
            ${rowsHtml}
          </table>
          <div style="margin-top:20px;">
            <div style="font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#C8A865;margin-bottom:6px;">Message</div>
            <p style="white-space:pre-wrap;margin:0;font-size:14px;line-height:1.7;color:#1A1F1A;">${esc(message)}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="background:#FAF5E8;padding:20px 32px;border-top:1px solid #E2DAC4;font-size:12px;line-height:1.6;color:#6B7269;">
          Patagonia Americas LLC · 300 SE 2nd Street, Suite 600, Fort Lauderdale, FL 33301, USA<br/>
          <a href="mailto:Exports@patagoniaamericas.com" style="color:#A6864F;">Exports@patagoniaamericas.com</a>
        </td>
      </tr>
    </table>
  </div>`;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
