import { fetchWithTimeout } from './fetchWithTimeout';

const API_BASE = '/api';

async function parseResponse(res, fallbackMessage = 'Request failed') {
  const contentType = res.headers.get('content-type') || '';
  let data;
  try {
    if (!contentType.includes('application/json')) {
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Requested service route not found (404). Make sure the backend server has this route.');
        }
        throw new Error(
          res.status === 503
            ? 'Database is not connected. Check MongoDB in .env and restart with npm run dev:all.'
            : `Server returned error (${res.status}). Make sure the backend server is running.`
        );
      }
      throw new Error('Unexpected server response format.');
    }
    data = await res.json();
  } catch (err) {
    if (err.message && !err.message.includes('JSON') && !err.name?.includes('SyntaxError')) {
      throw err;
    }
    throw new Error('Backend server is not running or returned invalid response.');
  }
  if (!res.ok) {
    throw new Error(data.message || fallbackMessage);
  }
  return data;
}

export async function checkApiHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return parseResponse(res, 'Health check failed');
}

export async function sendVerificationCode(email, purpose = 'reset') {
  const res = await fetchWithTimeout(`${API_BASE}/user/send-reset-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, purpose }),
  }, 15000);
  return parseResponse(res, 'Failed to send reset email. Please try again later.');
}

export async function verifyCode(email, code, purpose = 'reset') {
  const res = await fetch(`${API_BASE}/user/verify-reset-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, purpose }),
  });
  return parseResponse(res, 'Failed to verify code');
}

export async function sendContactMessage({ name, email, type, message }) {
  const res = await fetchWithTimeout(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, type, message }),
  }, 10000);
  return parseResponse(res, 'Failed to send contact message');
}

export async function sendWelcomeEmail({ firstName, email }) {
  const res = await fetch(`${API_BASE}/welcome-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, email }),
  });
  return parseResponse(res, 'Failed to send welcome email');
}
