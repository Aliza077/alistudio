const CACHE_TTL_MS = 5 * 60 * 1000;

export function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.expiresAt || Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export function writeCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({
      data,
      expiresAt: Date.now() + CACHE_TTL_MS,
    }));
  } catch {
    // Ignore quota errors
  }
}
