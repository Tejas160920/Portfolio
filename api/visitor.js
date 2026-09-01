const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, role, company, likes } = req.body;

  // `role` and `company` are now the two chip answers. They come from fixed
  // lists in the UI, but this endpoint is public, so escape anything that
  // reaches the HTML body regardless.
  const esc = (v) =>
    String(v ?? '')
      .slice(0, 120)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const who = esc(role) || 'Someone';
  const why = esc(company) || 'Not specified';
  const count = Number.isFinite(Number(likes)) ? Number(likes) : 0;

  // Check if env variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Missing EMAIL_USER or EMAIL_PASS environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Create transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Get current time
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Portfolio visitor: ${who}${why !== 'Not specified' ? ` — ${why}` : ''}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4ade80; border-bottom: 2px solid #4ade80; padding-bottom: 10px;">
          Someone liked your portfolio! 💚
        </h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; width: 140px;">They are a:</td>
              <td style="padding: 10px 0;">${who}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Here for:</td>
              <td style="padding: 10px 0;">${why}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Likes given:</td>
              <td style="padding: 10px 0;">${count} ❤️</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Time:</td>
              <td style="padding: 10px 0;">${timestamp}</td>
            </tr>
          </table>
        </div>
        <p style="color: #888; font-size: 12px;">
          This visitor liked your portfolio and shared their info!
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Visitor info sent successfully' });
  } catch (error) {
    console.error('Email error:', error.message);
    return res.status(500).json({ error: 'Failed to send email: ' + error.message });
  }
};
