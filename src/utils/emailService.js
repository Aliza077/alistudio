const API_BASE = '/api';

async function parseResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('Email server is not running. Run: npm run dev:all');
  }
  if (!res.ok) {
    throw new Error(data.message || 'Failed to send verification code');
  }
  return data;
}

export async function sendVerificationCode(email, purpose) {
  const res = await fetch(`${API_BASE}/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, purpose }),
  });
  return parseResponse(res);
}

export async function verifyCode(email, code, purpose) {
  const res = await fetch(`${API_BASE}/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, purpose }),
  });
  return parseResponse(res);
}
