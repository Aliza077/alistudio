import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const verificationCodes = new Map();

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function cleanupExpiredCodes() {
  const now = Date.now();
  for (const [key, data] of verificationCodes.entries()) {
    if (now - data.createdAt > 10 * 60 * 1000) {
      verificationCodes.delete(key);
    }
  }
}

setInterval(cleanupExpiredCodes, 60 * 1000);

function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user, pass },
  });
}

async function sendResetEmail(to, code) {
  const transporter = createTransporter();

  if (!transporter) {
    return { sent: false, reason: 'Gmail credentials not configured in .env file' };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #fff; border-radius: 12px;">
      <h2 style="color: #c5a880; margin-bottom: 8px;">Ali Studio</h2>
      <p style="color: #aaa; margin-bottom: 24px;">Use this code to reset your password.</p>
      <div style="background: #1a1a1a; border: 1px solid #c5a880; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #c5a880;">${code}</span>
      </div>
      <p style="color: #666; font-size: 12px;">This code expires in 10 minutes. Do not share it with anyone.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Ali Studio" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'Ali Studio - Password Reset Code',
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error('Gmail send error:', err.message);
    return { sent: false, reason: err.message };
  }
}

app.post('/api/send-code', async (req, res) => {
  try {
    const { email, purpose } = req.body;

    if (!email || !purpose) {
      return res.status(400).json({ success: false, message: 'Email and purpose are required.' });
    }

    if (purpose !== 'reset') {
      return res.status(400).json({ success: false, message: 'Verification codes are only sent for password reset.' });
    }

    const code = generateCode();
    const key = `${email.toLowerCase()}_reset`;
    verificationCodes.set(key, { code, createdAt: Date.now() });

    const result = await sendResetEmail(email, code);

    if (!result.sent) {
      verificationCodes.delete(key);
      return res.status(503).json({
        success: false,
        message: result.reason || 'Failed to send email. Check Gmail settings in .env file.',
      });
    }

    res.json({
      success: true,
      message: `Password reset code sent to ${email}. Check your Gmail inbox.`,
    });
  } catch (err) {
    console.error('Send code error:', err);
    res.status(500).json({ success: false, message: 'Failed to send verification code.' });
  }
});

app.post('/api/verify-code', (req, res) => {
  const { email, code, purpose } = req.body;

  if (!email || !code || !purpose) {
    return res.status(400).json({ success: false, message: 'Email, code, and purpose are required.' });
  }

  if (purpose !== 'reset') {
    return res.status(400).json({ success: false, message: 'Invalid verification purpose.' });
  }

  const key = `${email.toLowerCase()}_reset`;
  const stored = verificationCodes.get(key);

  if (!stored) {
    return res.status(400).json({ success: false, message: 'No verification code found. Please request a new one.' });
  }

  if (Date.now() - stored.createdAt > 10 * 60 * 1000) {
    verificationCodes.delete(key);
    return res.status(400).json({ success: false, message: 'Code expired. Please request a new one.' });
  }

  if (stored.code !== code) {
    return res.status(400).json({ success: false, message: 'Invalid verification code.' });
  }

  verificationCodes.delete(key);
  res.json({ success: true, message: 'Code verified successfully.' });
});

app.get('/api/health', (_req, res) => {
  const hasGmail = !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
  res.json({ status: 'ok', gmailConfigured: hasGmail });
});

app.listen(PORT, () => {
  const hasGmail = !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
  console.log(`Email server running on http://localhost:${PORT}`);
  console.log(hasGmail ? 'Gmail configured — reset codes will be sent to inbox.' : 'Gmail NOT configured — create .env with GMAIL_USER and GMAIL_APP_PASSWORD');
});
