import { Router } from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import HomeSettings from '../models/HomeSettings.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { requireDB } from '../middleware/db.js';
import { resolveImageUrl } from '../cloudinary.js';

const router = Router();

const DEFAULT_SLIDES = [
  { image: '/slide1.png', title: 'Transforming Spaces', subtitle: 'Into Extraordinary Experiences' },
  { image: '/slide2.png', title: 'Minimalist Elegance', subtitle: 'Crafted For Modern Living' },
  { image: '/slide3.png', title: 'Futuristic Workspaces', subtitle: 'Designed For Absolute Focus' },
];

const DEFAULT_MEGA = {
  festTag: '6.6 MID YEAR FESTIVAL',
  title: 'MEGA DEALS',
  discountText: 'UP TO 80% OFF ON PREMIUM LUXURY FURNITURE',
  datesLabel: '5 JUNE (8PM) - 10 JUNE',
  images: [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80',
  ],
};

async function getOrCreateSettings() {
  let settings = await HomeSettings.findOne({ key: 'default' });
  if (!settings) {
    settings = await HomeSettings.create({
      key: 'default',
      slides: DEFAULT_SLIDES,
      megaDeals: DEFAULT_MEGA,
    });
  }
  return settings;
}

router.get('/stats', requireDB, requireAuth, requireAdmin, async (_req, res) => {
  try {
    const [totalUsers, totalProducts, orders, categoryBreakdown] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.find().sort({ createdAt: -1 }),
      Product.aggregate([
        {
          $group: {
            _id: '$category',
            stock: { $sum: '$quantity' },
            count: { $sum: 1 },
          },
        },
        { $sort: { stock: -1 } },
      ]),
    ]);

    const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    res.json({
      success: true,
      data: {
        totalSales,
        totalOrders: orders.length,
        totalUsers,
        totalProducts,
        recentOrders: orders.slice(0, 8),
        categoryBreakdown,
      },
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats.' });
  }
});

router.get('/home-settings', async (_req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ status: 'success', success: true, data: settings });
  } catch (err) {
    console.error('Home settings get error:', err);
    res.json({
      status: 'success',
      success: true,
      data: { slides: DEFAULT_SLIDES, megaDeals: DEFAULT_MEGA },
    });
  }
});

router.put('/home-settings', requireDB, requireAuth, requireAdmin, async (req, res) => {
  try {
    const { slides = [], megaDeals = {} } = req.body;

    const processedSlides = [];
    for (const slide of slides) {
      let image = slide.image || '';
      if (image.startsWith('data:image')) {
        image = await resolveImageUrl(image, 'ali-studio/carousel');
      }
      processedSlides.push({
        image,
        title: slide.title || '',
        subtitle: slide.subtitle || '',
      });
    }

    const dealImages = [];
    for (const img of megaDeals.images || []) {
      if (img?.startsWith('data:image')) {
        dealImages.push(await resolveImageUrl(img, 'ali-studio/deals'));
      } else if (img) {
        dealImages.push(img);
      }
    }

    const settings = await HomeSettings.findOneAndUpdate(
      { key: 'default' },
      {
        slides: processedSlides,
        megaDeals: {
          festTag: megaDeals.festTag || DEFAULT_MEGA.festTag,
          title: megaDeals.title || DEFAULT_MEGA.title,
          discountText: megaDeals.discountText || DEFAULT_MEGA.discountText,
          datesLabel: megaDeals.datesLabel || DEFAULT_MEGA.datesLabel,
          images: dealImages.length ? dealImages : DEFAULT_MEGA.images,
        },
      },
      { upsert: true, new: true }
    );

    res.json({ status: 'success', success: true, data: settings, message: 'Home settings saved.' });
  } catch (err) {
    console.error('Home settings save error:', err);
    res.status(500).json({ status: 'error', success: false, message: err.message || 'Failed to save settings.' });
  }
});

router.get('/orders', requireDB, requireAuth, requireAdmin, async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error('Orders list error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});

router.put('/orders/:id/payment-status', requireDB, requireAuth, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: req.body.paymentStatus || 'Pending' },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    console.error('Payment status error:', err);
    res.status(500).json({ success: false, message: 'Failed to update payment status.' });
  }
});

export default router;
