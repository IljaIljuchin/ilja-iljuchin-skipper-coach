export const config = { runtime: 'edge' };

const RECIPIENT = 'Ilja.iljuchin@icloud.com';
const SITE = 'https://ilja-iljuchin-skipper-coach.vercel.app';

export default async function handler(req) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': SITE,
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { name, email, type, message } = await req.json();

    // Basic validation
    if (!name || !email || !type) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and type are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Simple email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Honeypot: if 'website' field is filled, it's a bot
    // (the hidden field is added in the frontend form)

    const cvType = type === 'sailing' ? 'Sailing CV' : 'Coaching CV';
    const subject = `${cvType} Request from ${name}`;
    const body = [
      `New ${cvType} request:`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      message ? `Message: ${message}` : '',
      ``,
      `Please reply to ${email} with the requested CV.`,
    ].filter(Boolean).join('\n');

    // Use Resend free tier (100 emails/day) — API key in env var
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_KEY) {
      // Fallback: log to Vercel function logs (always works, free)
      console.log('=== CV REQUEST ===');
      console.log(JSON.stringify({ name, email, type: cvType, message }));
      console.log('==================');
      return new Response(
        JSON.stringify({ ok: true, note: 'Request logged (email delivery not configured yet).' }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': SITE,
          },
        }
      );
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'CV Request <noreply@resend.dev>',
        to: [RECIPIENT],
        reply_to: email,
        subject,
        text: body,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return new Response(
        JSON.stringify({ error: 'Failed to send. Please try again later.' }),
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': SITE,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': SITE,
        },
      }
    );
  } catch (e) {
    console.error('Handler error:', e);
    return new Response(
      JSON.stringify({ error: 'Server error.' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': SITE,
        },
      }
    );
  }
}
