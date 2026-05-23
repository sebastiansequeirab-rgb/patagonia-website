// Vercel Serverless Function — receives contact-form submissions and sends email
// through the official Resend SDK (https://resend.com).
//
// Environment variables (Vercel → Settings → Environment Variables, and .env for
// local `vercel dev`):
//   RESEND_API_KEY      — API key from https://resend.com/api-keys   (REQUIRED)
//   CONTACT_FROM_EMAIL  — sender; must use the Resend-verified domain.
//                         Defaults to "Patagonia Americas <noreply@patagoniaamericas.com>".
//   CONTACT_TO_EMAIL    — company inbox. Defaults to Exports@patagoniaamericas.com.
//
// Behaviour: sends TWO emails per submission —
//   1) a confirmation to the visitor (localized EN/ES, reply-to = company inbox), and
//   2) a lead notification to the company inbox (English, reply-to = visitor).
// Dispatched with Promise.allSettled so one failing doesn't block the other.

import { Resend } from 'resend';

const SUBJECT_LABELS = {
  sourcing:    { en: 'Sourcing & Procurement',     es: 'Originación y Compras' },
  supply:      { en: 'Ongoing Supply Agreement',   es: 'Acuerdo de Suministro Continuo' },
  logistics:   { en: 'Logistics & Shipping',       es: 'Logística y Envíos' },
  partnership: { en: 'Partnership Opportunity',    es: 'Oportunidad de Alianza' },
  press:       { en: 'Press & Media',              es: 'Prensa y Medios' },
  other:       { en: 'Other Inquiry',              es: 'Otra Consulta' }
};

const T = {
  en: {
    labels: { name: 'Name', company: 'Company', email: 'Email', phone: 'Phone', reason: 'Reason' },
    messageWord: 'Message',
    subject: (name) => `Patagonia Americas — we received your inquiry, ${name}`,
    heading: (name) => `Thank you, ${name}.`,
    intro: 'We received your inquiry and our trading desk will be in touch shortly, typically within one business day. For your records, here is a copy of what you submitted:',
    footer: 'Patagonia Americas LLC · 300 SE 2nd Street, Suite 600, Fort Lauderdale, FL 33301, USA'
  },
  es: {
    labels: { name: 'Nombre', company: 'Empresa', email: 'Correo', phone: 'Teléfono', reason: 'Motivo' },
    messageWord: 'Mensaje',
    subject: (name) => `Patagonia Americas — recibimos su consulta, ${name}`,
    heading: (name) => `Gracias, ${name}.`,
    intro: 'Recibimos su consulta y nuestro equipo comercial se pondrá en contacto a la brevedad, normalmente dentro de un día hábil. Para su registro, esta es una copia de lo que envió:',
    footer: 'Patagonia Americas LLC · 300 SE 2nd Street, Suite 600, Fort Lauderdale, FL 33301, EE. UU.'
  }
};

const cap = (s, n) => String(s || '').trim().slice(0, n);

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};

  // Honeypot: a hidden field real users never fill. If present, accept silently
  // (so bots get a 200 and don't learn) but send nothing.
  if (cap(body.company_website, 1)) {
    return res.status(200).json({ ok: true, delivered: { visitor: false, company: false } });
  }

  const name    = cap(body.name, 200);
  const company = cap(body.company, 200);
  const email   = cap(body.email, 200);
  const phone   = cap(body.phone, 60);
  const subjectKey = cap(body.subject, 40);
  const message = cap(body.message, 8000);
  const lang = String(body.lang || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';

  // name, email and message are required; company / phone / subject are optional.
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set.');
    return res.status(500).json({ error: 'Email service is not configured' });
  }

  const from = process.env.CONTACT_FROM_EMAIL || 'Patagonia Americas <noreply@patagoniaamericas.com>';
  const companyInbox = process.env.CONTACT_TO_EMAIL || 'Exports@patagoniaamericas.com';
  const reason = SUBJECT_LABELS[subjectKey] || { en: subjectKey || 'General Inquiry', es: subjectKey || 'Consulta General' };

  // Build the field rows for a given language label-set.
  const build = (labels, reasonLabel, extra = []) => {
    const fields = [
      [labels.name, name],
      [labels.company, company],
      [labels.email, email],
      [labels.phone, phone],
      [labels.reason, reasonLabel],
      ...extra
    ].filter(([, v]) => v);
    const html = fields.map(([l, v]) => `
      <tr>
        <td style="padding:8px 20px 8px 0;font-weight:600;color:#1F2D24;white-space:nowrap;vertical-align:top;">${esc(l)}</td>
        <td style="padding:8px 0;color:#1A1F1A;">${esc(v)}</td>
      </tr>`).join('');
    const text = fields.map(([l, v]) => `${l}: ${v}`).join('\n');
    return { html, text };
  };

  // 1) Confirmation email — sent to the visitor, in their chosen language.
  const t = T[lang];
  const v = build(t.labels, reason[lang]);
  const visitorHtml = shell(t.heading(name), t.intro, v.html, message, t.messageWord, t.footer);
  const visitorText =
    `${t.heading(name)}\n\n${t.intro}\n\n${v.text}\n\n${t.messageWord}:\n${message}\n\n— ${t.footer}`;

  // 2) Lead notification — sent to the company inbox (English, with the visitor's language noted).
  const langName = lang === 'es' ? 'Español' : 'English';
  const c = build(T.en.labels, reason.en, [['Language', langName]]);
  const companyHtml = shell(`New inquiry from ${name}.`, 'A new contact-form submission came in through the website:', c.html, message, 'Message', T.en.footer);
  const companyText = `New inquiry from the Patagonia Americas website\n\n${c.text}\n\nMessage:\n${message}`;

  const resend = new Resend(apiKey);
  const [toVisitor, toCompany] = await Promise.allSettled([
    resend.emails.send({
      from, to: email, replyTo: companyInbox,
      subject: t.subject(name),
      html: visitorHtml, text: visitorText
    }),
    resend.emails.send({
      from, to: companyInbox, replyTo: email,
      subject: `New inquiry: ${reason.en} — ${company || name}`,
      html: companyHtml, text: companyText
    })
  ]);

  const ok = (r) => r.status === 'fulfilled' && !r.value?.error;
  const visitorOk = ok(toVisitor);
  const companyOk = ok(toCompany);

  if (!visitorOk) console.error('[contact] visitor send failed:', toVisitor.reason || toVisitor.value?.error);
  if (!companyOk) console.error('[contact] company send failed:', toCompany.reason || toCompany.value?.error);

  // The company notification is the one that must arrive. Fail only if it didn't.
  if (!companyOk) {
    return res.status(502).json({ error: 'Email delivery failed' });
  }
  return res.status(200).json({ ok: true, delivered: { visitor: visitorOk, company: companyOk } });
}

// Branded email shell: inline styles + table, values injected by the caller.
function shell(heading, intro, rowsHtml, message, messageWord, footer) {
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
          <h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:24px;color:#1F2D24;">${esc(heading)}</h1>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.65;color:#4A5248;">${esc(intro)}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6;border-top:1px solid #E2DAC4;border-bottom:1px solid #E2DAC4;">
            ${rowsHtml}
          </table>
          <div style="margin-top:20px;">
            <div style="font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#C8A865;margin-bottom:6px;">${esc(messageWord)}</div>
            <p style="white-space:pre-wrap;margin:0;font-size:14px;line-height:1.7;color:#1A1F1A;">${esc(message)}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="background:#FAF5E8;padding:20px 32px;border-top:1px solid #E2DAC4;font-size:12px;line-height:1.6;color:#6B7269;">
          ${esc(footer)}<br/>
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
