import { Router } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import ContactMessage from '../models/ContactMessage.js';
import { requireAuth } from '../middleware/auth.js';
import { requireDB } from '../middleware/db.js';

const router = Router();

router.use(requireDB);

function generateTrackingId() {
  return 'ALI-' + Math.floor(100000 + Math.random() * 900000);
}

router.post('/checkout', requireAuth, async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      shippingAddress,
      email,
      cardHolder,
      cardNumberLast4,
      paymentMethod: rawMethod = 'Cash on Delivery',
      walletNumber = '',
    } = req.body;

    if (!items?.length || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Cart items and total amount are required.' });
    }

    const methodMap = {
      cod: 'Cash on Delivery',
      'cash on delivery': 'Cash on Delivery',
      cashondelivery: 'Cash on Delivery',
      easypaisa: 'EasyPaisa',
      jazzcash: 'JazzCash',
      nayapay: 'NayaPay',
      sadapay: 'SadaPay',
      card: 'Card',
      'bank card': 'Card',
      'credit card': 'Card',
    };
    const normalizedKey = String(rawMethod || 'cod').trim().toLowerCase();
    const paymentMethod = methodMap[normalizedKey] || (
      normalizedKey.includes('cash') ? 'Cash on Delivery'
        : normalizedKey === 'card' || normalizedKey.includes('bank') ? 'Card'
          : String(rawMethod).trim() || 'Cash on Delivery'
    );
    const isCod = paymentMethod === 'Cash on Delivery';

    console.log('[checkout] paymentMethod raw=', rawMethod, '→ saved=', paymentMethod, 'status=', isCod ? 'Pending' : 'Paid');

    for (const item of items) {
      if (item.productId && !String(item.productId).startsWith('seed-')) {
        try {
          const product = await Product.findById(item.productId);
          if (product) {
            product.quantity = Math.max(0, product.quantity - item.quantity);
            await product.save();
          }
        } catch {
          /* skip invalid product ids */
        }
      }
    }

    const order = await Order.create({
      userId: req.user._id,
      email: email || req.user.email,
      items,
      totalAmount,
      shippingAddress: shippingAddress || '',
      cardHolder: isCod ? '' : (cardHolder || ''),
      cardNumberLast4: isCod ? '' : (cardNumberLast4 || walletNumber?.slice(-4) || ''),
      paymentMethod,
      paymentStatus: isCod ? 'Pending' : 'Paid',
      trackingId: generateTrackingId(),
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: { trackingId: order.trackingId, order },
    });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ success: false, message: 'Checkout failed.' });
  }
});

router.get('/track/:trackingId', async (req, res) => {
  try {
    const order = await Order.findOne({ trackingId: req.params.trackingId.trim() }).select(
      'trackingId paymentStatus paymentMethod totalAmount shippingAddress createdAt items'
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'No order found for this tracking ID.' });
    }
    res.json({
      success: true,
      data: {
        trackingId: order.trackingId,
        status: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        total: order.totalAmount,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        items: order.items,
      },
    });
  } catch (err) {
    console.error('Track order error:', err);
    res.status(500).json({ success: false, message: 'Failed to track order.' });
  }
});

router.post('/help-request', async (req, res) => {
  try {
    const { type, trackingId, email, name, message } = req.body;
    if (!type || !trackingId) {
      return res.status(400).json({ success: false, message: 'Request type and tracking ID are required.' });
    }

    await ContactMessage.create({
      name: name || 'Help Center User',
      email: email || 'help@alistudio.local',
      type: `Help Center — ${type}`,
      message: message || `User requested "${type}" for tracking ID: ${trackingId}`,
    });

    res.json({
      success: true,
      message: `Your ${type} request for ${trackingId} was submitted. Our team will respond within 24 hours.`,
    });
  } catch (err) {
    console.error('Help request error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit help request.' });
  }
});

router.get('/all', requireAuth, async (req, res) => {
  try {
    if (req.user.urole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    res.json({ status: 'success', success: true, data: orders });
  } catch (err) {
    console.error('Orders list error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});

router.put('/status/:id', requireAuth, async (req, res) => {
  try {
    if (req.user.urole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: req.body.paymentStatus || 'Pending',
        status: req.body.status || undefined,
      },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ status: 'success', success: true, data: order });
  } catch (err) {
    console.error('Order status error:', err);
    res.status(500).json({ success: false, message: 'Failed to update order.' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    if (req.user.urole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, message: 'Order deleted.' });
  } catch (err) {
    console.error('Delete order error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete order.' });
  }
});

router.post('/delete/:id', requireAuth, async (req, res) => {
  try {
    if (req.user.urole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, message: 'Order deleted.' });
  } catch (err) {
    console.error('Delete order error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete order.' });
  }
});

router.post('/fix-payment/:trackingId', requireAuth, async (req, res) => {
  try {
    if (req.user.urole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }
    const order = await Order.findOneAndUpdate(
      { trackingId: req.params.trackingId },
      {
        paymentMethod: req.body.paymentMethod || 'Cash on Delivery',
        paymentStatus: req.body.paymentStatus || 'Pending',
      },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, data: order, message: 'Order payment info updated.' });
  } catch (err) {
    console.error('Fix payment error:', err);
    res.status(500).json({ success: false, message: 'Failed to fix order.' });
  }
});

export default router;
