import { v2 as cloudinary } from 'cloudinary';

function getCloudinaryConfig() {
  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.cloudinaryname,
    api_key: process.env.CLOUDINARY_API_KEY || process.env.cloudinarykey,
    api_secret: process.env.CLOUDINARY_API_SECRET || process.env.cloudinarysecret,
  };
}

export function isCloudinaryConfigured() {
  const cfg = getCloudinaryConfig();
  return !!(cfg.cloud_name && cfg.api_key && cfg.api_secret);
}

export function configureCloudinary() {
  if (!isCloudinaryConfigured()) {
    return false;
  }
  cloudinary.config(getCloudinaryConfig());
  return true;
}

export async function uploadImage(source, folder = 'ali-studio') {
  if (!source) {
    return { uploaded: false, url: '' };
  }

  if (!configureCloudinary()) {
    if (source.startsWith('http://') || source.startsWith('https://')) {
      return { uploaded: false, url: source };
    }
    return { uploaded: false, reason: 'Cloudinary is not configured in .env' };
  }

  try {
    const result = await cloudinary.uploader.upload(source, {
      folder,
      resource_type: 'image',
    });
    return { uploaded: true, url: result.secure_url };
  } catch (err) {
    console.error('Cloudinary upload error:', err.message);
    return { uploaded: false, reason: err.message };
  }
}

export async function resolveImageUrl(image, folder = 'ali-studio') {
  if (!image) {
    return '';
  }

  if (image.startsWith('data:image')) {
    const result = await uploadImage(image, folder);
    if (!result.url) {
      throw new Error(result.reason || 'Failed to upload image to Cloudinary');
    }
    return result.url;
  }

  if (image.includes('res.cloudinary.com')) {
    return image;
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    const result = await uploadImage(image, folder);
    return result.url || image;
  }

  return image;
}
