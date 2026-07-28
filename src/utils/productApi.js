import { catalogFallback, findCatalogProduct } from '../data/catalogFallback';
import { readCache, writeCache } from './homeCache';

export async function fetchProducts() {
  const cached = readCache('ali_products');
  if (cached?.length) {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data) && data.data.length > 0) {
          writeCache('ali_products', data.data);
        }
      })
      .catch(() => {});
    return cached;
  }

  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
      writeCache('ali_products', data.data);
      return data.data;
    }
  } catch (err) {
    console.error('Products API unavailable, using offline catalog.', err);
  }
  return catalogFallback;
}

export async function fetchProductById(id) {
  try {
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();
    if (res.ok && data.data) {
      return data.data;
    }
  } catch (err) {
    console.error('Product API unavailable, using offline catalog.', err);
  }
  return findCatalogProduct(id);
}
