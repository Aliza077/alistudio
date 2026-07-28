import { getAuthHeaders } from './authHelpers';

export async function uploadImage(imageData, folder = 'ali-studio/products') {
  const res = await fetch('/api/upload/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ image: imageData, folder }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Image upload failed');
  }
  return data.data.url;
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
