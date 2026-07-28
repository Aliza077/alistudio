import { Router } from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { requireAuth } from '../middleware/auth.js';
import { requireDB } from '../middleware/db.js';
import { isDBConnected } from '../db.js';

const router = Router();

router.get('/product/:productId', async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.json({ success: true, data: [] });
    }
    const reviews = await Review.find({ productId: req.params.productId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: reviews });
  } catch (err) {
    console.error('Reviews list error:', err);
    res.json({ success: true, data: [] });
  }
});

router.post('/product/:productId', requireDB, requireAuth, async (req, res) => {
  try {
    const { rating, comment, name } = req.body;
    if (!rating || !comment?.trim()) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required.' });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const review = await Review.create({
      productId: product._id,
      userId: req.user._id,
      name: name || req.user.name || 'Customer',
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment: comment.trim(),
    });

    res.status(201).json({ success: true, data: review, message: 'Review submitted.' });
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
});

export default router;
