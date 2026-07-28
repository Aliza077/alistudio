import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDB, isDBConnected } from './db.js';
import { seedDatabase } from './seed.js';
import { isGmailConfigured, sendMail, buildContactEmail, buildWelcomeEmail } from './mail.js';
import ContactMessage from './models/ContactMessage.js';
import { isCloudinaryConfigured } from './cloudinary.js';
import userRoutes from './routes/user.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';
import categoryRoutes from './routes/category.js';
import reviewRoutes from './routes/reviews.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.GMAIL_USER;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    gmailConfigured: isGmailConfigured(),
    cloudinaryConfigured: isCloudinaryConfigured(),
    databaseConfigured: !!process.env.DATABASE,
    databaseConnected: isDBConnected(),
    port: PORT,
  });
});

app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/reviews', reviewRoutes);

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, type, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const inquiryType = type || 'General Inquiry';
    let savedMessage = null;

    if (isDBConnected()) {
      savedMessage = await ContactMessage.create({
        name,
        email,
        type: inquiryType,
        message,
      });
    }

    if (savedMessage) {
      res.json({
        success: true,
        message: 'Message received successfully. We will respond within 24 hours.',
      });

      if (ADMIN_EMAIL) {
        sendMail({
          to: ADMIN_EMAIL,
          subject: `Ali Studio Contact — ${inquiryType}`,
          html: buildContactEmail({ name, email, type: inquiryType, message }),
          text: `From: ${name} (${email})\nType: ${inquiryType}\n\n${message}`,
        })
          .then((result) => {
            if (result.sent) {
              ContactMessage.findByIdAndUpdate(savedMessage._id, { emailSent: true }).catch(() => {});
            }
          })
          .catch(() => {});
      }
      return;
    }

    if (!ADMIN_EMAIL) {
      return res.status(503).json({ success: false, message: 'Contact service is temporarily unavailable.' });
    }

    const result = await sendMail({
      to: ADMIN_EMAIL,
      subject: `Ali Studio Contact — ${inquiryType}`,
      html: buildContactEmail({ name, email, type: inquiryType, message }),
      text: `From: ${name} (${email})\nType: ${inquiryType}\n\n${message}`,
    });

    if (!result.sent) {
      return res.status(503).json({
        success: false,
        message: result.reason || 'Failed to send contact message. Please try again later.',
      });
    }

    res.json({ success: true, message: 'Message sent successfully. We will respond within 24 hours.' });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ success: false, message: 'Failed to send contact message.' });
  }
});

app.post('/api/welcome-email', async (req, res) => {
  try {
    const { firstName, email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const result = await sendMail({
      to: email,
      subject: 'Welcome to Ali Studio',
      html: buildWelcomeEmail({ firstName, email }),
      text: `Welcome to Ali Studio, ${firstName || 'there'}! Your account is ready.`,
    });

    if (!result.sent) {
      return res.status(503).json({
        success: false,
        message: result.reason || 'Failed to send welcome email.',
      });
    }

    res.json({ success: true, message: 'Welcome email sent.' });
  } catch (err) {
    console.error('Welcome email error:', err);
    res.status(500).json({ success: false, message: 'Failed to send welcome email.' });
  }
});

app.get('/api/geocode/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ success: false, message: 'lat and lon are required.' });
    }
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
    const geoRes = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'AliStudioDashboard/1.0 (local-dev)',
      },
    });
    if (!geoRes.ok) {
      return res.status(502).json({ success: false, message: 'Geocoder unavailable.' });
    }
    const data = await geoRes.json();
    res.json({
      success: true,
      address: data.display_name || `${lat}, ${lon}`,
      lat: Number(lat),
      lng: Number(lon),
    });
  } catch (err) {
    console.error('Reverse geocode error:', err);
    res.status(500).json({ success: false, message: 'Failed to reverse geocode.' });
  }
});

app.get('/api/geocode/search', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) {
      return res.status(400).json({ success: false, message: 'q is required.' });
    }
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`;
    const geoRes = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'AliStudioDashboard/1.0 (local-dev)',
      },
    });
    if (!geoRes.ok) {
      return res.status(502).json({ success: false, message: 'Geocoder unavailable.' });
    }
    const data = await geoRes.json();
    if (!data[0]) {
      return res.json({ success: true, data: null });
    }
    res.json({
      success: true,
      data: {
        address: data[0].display_name,
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      },
    });
  } catch (err) {
    console.error('Search geocode error:', err);
    res.status(500).json({ success: false, message: 'Failed to search location.' });
  }
});

async function startServer() {
  const connected = await connectDB();
  if (connected) {
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
    console.log(
      isGmailConfigured()
        ? `Gmail configured (${process.env.GMAIL_USER}) — emails via Nodemailer.`
        : 'Gmail NOT configured — add GMAIL_USER and GMAIL_APP_PASSWORD to .env'
    );
    console.log(
      isCloudinaryConfigured()
        ? `Cloudinary configured (${process.env.CLOUDINARY_CLOUD_NAME || process.env.cloudinaryname}) — images stored in cloud.`
        : 'Cloudinary NOT configured — add CLOUDINARY_* keys to .env'
    );
  });
}

startServer();
