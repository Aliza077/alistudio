import { Router } from 'express';
import Product from '../models/Product.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { requireDB } from '../middleware/db.js';
import { isDBConnected } from '../db.js';
import { seedProducts } from '../data/seedProducts.js';
import { resolveImageUrl } from '../cloudinary.js';

const router = Router();

function getFallbackProducts() {
  return seedProducts.map((product, index) => ({
    _id: `seed-${index + 1}`,
    ...product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

function findFallbackProduct(id) {
  const products = getFallbackProducts();
  return products.find((p) => p._id === id) || products[Number(id) - 1] || null;
}

router.get('/', async (_req, res) => {
  try {
    if (!isDBConnected()) {
      return res.json({ success: true, data: getFallbackProducts(), source: 'catalog' });
    }

    const products = await Product.find().sort({ createdAt: -1 });
    const withImages = products.filter((p) => p.image && String(p.image).trim());
    res.json({ success: true, data: withImages });
  } catch (err) {
    console.error('Products list error:', err);
    res.json({ success: true, data: getFallbackProducts(), source: 'catalog' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!isDBConnected()) {
      const product = findFallbackProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }
      return res.json({ success: true, data: product });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    console.error('Product detail error:', err);
    const product = findFallbackProduct(req.params.id);
    if (product) {
      return res.json({ success: true, data: product });
    }
    res.status(500).json({ success: false, message: 'Failed to fetch product.' });
  }
});

router.post('/', requireDB, requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, category, price, quantity, description, image } = req.body;

    if (!title || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Title, category, price, and quantity are required.' });
    }

    let imageUrl = '';
    if (image) {
      imageUrl = await resolveImageUrl(image, 'ali-studio/products');
    }

    const product = await Product.create({
      title,
      category,
      price: Number(price),
      quantity: Number(quantity),
      description: description || '',
      image: imageUrl,
    });

    res.status(201).json({ success: true, data: product, message: 'Product created.' });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
});

router.put('/:id', requireDB, requireAuth, requireAdmin, async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    let imageUrl = existing.image;
    if (req.body.image && req.body.image !== existing.image) {
      imageUrl = await resolveImageUrl(req.body.image, 'ali-studio/products');
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        category: req.body.category,
        price: Number(req.body.price),
        quantity: Number(req.body.quantity),
        description: req.body.description || '',
        image: imageUrl,
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, data: product, message: 'Product updated.' });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
});

router.delete('/cleanup-no-image', requireDB, requireAuth, requireAdmin, async (_req, res) => {
  try {
    const result = await Product.deleteMany({
      $or: [
        { image: { $exists: false } },
        { image: null },
        { image: '' },
      ],
    });
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} product(s) without images.`,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error('Cleanup products error:', err);
    res.status(500).json({ success: false, message: 'Failed to cleanup products.' });
  }
});

router.delete('/:id', requireDB, requireAuth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
});

export default router;
