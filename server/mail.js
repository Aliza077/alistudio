import nodemailer from 'nodemailer';

export function isGmailConfigured() {
  return !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

function getAuth() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '');
  if (!user || !pass) return null;
  return { user, pass };
}

export function createTransporter() {
  const auth = getAuth();
  if (!auth) return null;

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4,
    connectionTimeout: 12000,
    greetingTimeout: 12000,
    socketTimeout: 15000,
    auth,
    tls: { rejectUnauthorized: false },
  });
}

function createFallbackTransporter() {
  const auth = getAuth();
  if (!auth) return null;

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    family: 4,
    connectionTimeout: 12000,
    greetingTimeout: 12000,
    socketTimeout: 15000,
    auth,
    tls: { rejectUnauthorized: false },
  });
}

function withMailTimeout(promise, ms = 12000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email delivery timed out (SMTP)')), ms);
    }),
  ]);
}

export async function sendMail({ to, subject, html, text }) {
  const primary = createTransporter();
  if (!primary) {
    return { sent: false, reason: 'Gmail credentials not configured in .env file' };
  }

  const fromEmail = process.env.GMAIL_USER;
  const mailOptions = {
    from: `"Ali Studio" <${fromEmail}>`,
    to,
    subject,
    html,
    text,
    replyTo: process.env.GMAIL_FROM || fromEmail,
  };

  try {
    await withMailTimeout(primary.sendMail(mailOptions));
    return { sent: true };
  } catch (primaryErr) {
    console.error('Gmail primary send error:', primaryErr.message);
    try {
      const fallback = createFallbackTransporter();
      if (!fallback) throw primaryErr;
      await withMailTimeout(fallback.sendMail(mailOptions));
      return { sent: true };
    } catch (fallbackErr) {
      console.error('Gmail fallback send error:', fallbackErr.message);
      return { sent: false, reason: fallbackErr.message || primaryErr.message };
    }
  }
}

export function buildResetCodeEmail(code) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #fff; border-radius: 12px;">
      <h2 style="color: #c5a880; margin-bottom: 8px;">Ali Studio</h2>
      <p style="color: #aaa; margin-bottom: 24px;">Use this code to reset your password.</p>
      <div style="background: #1a1a1a; border: 1px solid #c5a880; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #c5a880;">${code}</span>
      </div>
      <p style="color: #666; font-size: 12px;">This code expires in 10 minutes. Do not share it with anyone.</p>
    </div>
  `;
}

export function buildContactEmail({ name, email, type, message }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 28px; background: #0a0a0a; color: #fff; border-radius: 12px;">
      <h2 style="color: #c5a880; margin-bottom: 16px;">New Contact Message</h2>
      <p style="color: #aaa; margin: 0 0 8px;"><strong style="color:#fff;">From:</strong> ${name}</p>
      <p style="color: #aaa; margin: 0 0 8px;"><strong style="color:#fff;">Email:</strong> ${email}</p>
      <p style="color: #aaa; margin: 0 0 16px;"><strong style="color:#fff;">Type:</strong> ${type}</p>
      <div style="background: #141414; border: 1px solid #333; border-radius: 8px; padding: 16px;">
        <p style="color: #ddd; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>
    </div>
  `;
}

export function buildWelcomeEmail({ firstName, email }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #fff; border-radius: 12px;">
      <h2 style="color: #c5a880; margin-bottom: 8px;">Welcome to Ali Studio</h2>
      <p style="color: #aaa; margin-bottom: 16px;">Hi ${firstName || 'there'}, your account has been created successfully.</p>
      <p style="color: #aaa; margin: 0;">You can now sign in with <strong style="color:#fff;">${email}</strong> and explore our premium furniture collection.</p>
    </div>
  `;
}
