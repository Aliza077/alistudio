import { Router } from 'express';
import Category from '../models/Category.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { requireDB } from '../middleware/db.js';
import { resolveImageUrl } from '../cloudinary.js';

const router = Router();

router.get('/getall', async (_req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    res.json({ status: 'success', success: true, data: categories });
  } catch (err) {
    console.error('Categories list error:', err);
    res.status(500).json({ status: 'error', success: false, message: 'Failed to fetch categories.' });
  }
});

router.post('/create', requireDB, requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, image, label } = req.body;
    const trimmedName = name?.trim();
    const resolvedName = trimmedName || `Category ${Date.now()}`;

    if (!trimmedName && !image) {
      return res.status(400).json({ status: 'error', message: 'Provide a category name or thumbnail image.' });
    }

    let imageUrl = '';
    if (image) {
      imageUrl = await resolveImageUrl(image, 'ali-studio/categories');
    }

    const count = await Category.countDocuments();
    const category = await Category.create({
      name: resolvedName,
      label: (label || trimmedName || resolvedName).trim(),
      image: imageUrl,
      sortOrder: count,
    });

    res.status(201).json({ status: 'success', success: true, data: category, message: 'Category created.' });
  } catch (err) {
    console.error('Create category error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ status: 'error', message: 'Category name already exists.' });
    }
    res.status(500).json({ status: 'error', message: err.message || 'Failed to create category.' });
  }
});

router.put('/update/:id', requireDB, requireAuth, requireAdmin, async (req, res) => {
  try {
    const existing = await Category.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Category not found.' });
    }

    let imageUrl = existing.image;
    if (req.body.image && req.body.image !== existing.image) {
      imageUrl = await resolveImageUrl(req.body.image, 'ali-studio/categories');
    }

    existing.name = req.body.name?.trim() || existing.name;
    existing.label = (req.body.label || req.body.name || existing.label).trim();
    existing.image = imageUrl;
    await existing.save();

    res.json({ status: 'success', success: true, data: existing, message: 'Category updated.' });
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to update category.' });
  }
});

router.delete('/delete/:id', requireDB, requireAuth, requireAdmin, async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Category not found.' });
    }
    res.json({ status: 'success', success: true, message: 'Category deleted.' });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to delete category.' });
  }
});

export default router;
