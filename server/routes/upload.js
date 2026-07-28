import { Router } from 'express';
import { uploadImage, isCloudinaryConfigured } from '../cloudinary.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/status', (_req, res) => {
  res.json({ success: true, cloudinaryConfigured: isCloudinaryConfigured() });
});

router.post('/image', requireAuth, async (req, res) => {
  try {
    const { image, folder = 'ali-studio' } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Image data is required.' });
    }

    const result = await uploadImage(image, folder);

    if (!result.url) {
      return res.status(503).json({
        success: false,
        message: result.reason || 'Cloudinary upload failed. Check .env credentials.',
      });
    }

    res.json({
      success: true,
      data: { url: result.url, uploaded: result.uploaded },
      message: 'Image uploaded successfully.',
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: 'Image upload failed.' });
  }
});

export default router;
