import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import { signToken, requireAuth, requireAdmin } from '../middleware/auth.js';
import { requireDB } from '../middleware/db.js';
import { resolveImageUrl } from '../cloudinary.js';
import { formatUserResponse } from '../utils/userResponse.js';
import { sendMail, buildResetCodeEmail } from '../mail.js';

const router = Router();

router.use(requireDB);

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.get('/me', requireAuth, async (req, res) => {
  try {
    if (!req.user.isactive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated.' });
    }
    res.json({ success: true, data: formatUserResponse(req.user) });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, username, email, phone, gender, password, image } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    if (username) {
      const usernameTaken = await User.findOne({ username: username.trim() });
      if (usernameTaken) {
        return res.status(409).json({ success: false, message: 'Username is already taken.' });
      }
    }

    let imageUrl = '';
    if (image) {
      imageUrl = await resolveImageUrl(image, 'ali-studio/avatars');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      username: (username || name).trim(),
      email: normalizedEmail,
      phone: phone || '',
      gender: gender || '',
      password: hashed,
      image: imageUrl,
      urole: 'user',
      isactive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: { id: user._id, email: user.email, image: user.image },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: err.message || 'Registration failed.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isactive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact support.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken(user);

    res.json({
      success: true,
      token,
      data: formatUserResponse(user),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed.' });
  }
});

router.post('/send-reset-code', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = null;
    try {
      user = await User.findOne({ email: normalizedEmail });
    } catch (dbErr) {
      console.error('User lookup failed:', dbErr.message);
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Check MongoDB and restart with npm run dev:all.',
      });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email address.' });
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    try {
      await PasswordReset.findOneAndUpdate(
        { email: normalizedEmail },
        { code, verified: false, expiresAt },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (resetErr) {
      console.error('PasswordReset save failed:', resetErr.message);
      return res.status(500).json({
        success: false,
        message: 'Could not save reset code. Restart backend and try again.',
      });
    }

    // Never block the user on slow Gmail SMTP — always return the code as fallback
    let emailSent = false;
    try {
      const mailPromise = sendMail({
        to: normalizedEmail,
        subject: 'Ali Studio - Password Reset Code',
        html: buildResetCodeEmail(code),
        text: `Your Ali Studio password reset code is ${code}. It expires in 10 minutes.`,
      });
      const result = await Promise.race([
        mailPromise,
        new Promise((resolve) => setTimeout(() => resolve({ sent: false, reason: 'timeout' }), 3000)),
      ]);
      emailSent = !!result.sent;
      if (!result.sent) mailPromise.catch(() => {});
    } catch (mailErr) {
      console.warn('Reset mail error:', mailErr.message);
    }

    console.log(`[reset-code] ${normalizedEmail} → ${code} (emailSent=${emailSent})`);

    return res.json({
      success: true,
      message: emailSent
        ? `Password reset code sent to ${normalizedEmail}. Check inbox/spam.`
        : `Reset code ready for ${normalizedEmail}. Use the code below (email may be delayed).`,
      fallbackCode: code,
      emailDelayed: !emailSent,
    });
  } catch (err) {
    console.error('Send reset code error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to send reset email. Please try again later.',
    });
  }
});

router.post('/verify-reset-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and code are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const stored = await PasswordReset.findOne({ email: normalizedEmail });

    if (!stored) {
      return res.status(400).json({ success: false, message: 'No verification code found. Please request a new one.' });
    }

    if (stored.expiresAt < new Date()) {
      await PasswordReset.deleteOne({ email: normalizedEmail });
      return res.status(400).json({ success: false, message: 'Code expired. Please request a new one.' });
    }

    if (stored.code !== code.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid verification code.' });
    }

    stored.verified = true;
    stored.expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await stored.save();

    res.json({ success: true, message: 'Code verified successfully.' });
  } catch (err) {
    console.error('Verify reset code error:', err);
    res.status(500).json({ success: false, message: 'Failed to verify code.' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, forgotpasswordcode, newPassword } = req.body;

    if (!email || !forgotpasswordcode || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, code, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const stored = await PasswordReset.findOne({ email: normalizedEmail, verified: true });

    if (!stored || stored.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'Please verify your reset code first.' });
    }

    if (stored.code !== forgotpasswordcode.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid reset code.' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await PasswordReset.deleteOne({ email: normalizedEmail });

    res.json({ success: true, message: 'Password reset successfully.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
});

router.get('/list', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    console.error('User list error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
});

async function handleUpdateRole(req, res) {
  try {
    const { userId, urole } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User id is required.' });
    }
    if (!['admin', 'user'].includes(urole)) {
      return res.status(400).json({ success: false, message: 'Role must be admin or user.' });
    }

    if (String(req.user._id) === String(userId) && urole !== 'admin') {
      return res.status(400).json({ success: false, message: 'You cannot remove your own admin role.' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { urole },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, data: user, message: `Role updated to ${urole}.` });
  } catch (err) {
    console.error('Update role error:', err);
    res.status(500).json({ success: false, message: 'Failed to update role.' });
  }
}

router.put('/update-role', requireAuth, requireAdmin, handleUpdateRole);
router.post('/update-role', requireAuth, requireAdmin, handleUpdateRole);

router.put('/:id/role', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { urole } = req.body;
    if (!['admin', 'user'].includes(urole)) {
      return res.status(400).json({ success: false, message: 'Role must be admin or user.' });
    }

    if (String(req.user._id) === String(req.params.id) && urole !== 'admin') {
      return res.status(400).json({ success: false, message: 'You cannot remove your own admin role.' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { urole },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, data: user, message: `Role updated to ${urole}.` });
  } catch (err) {
    console.error('Update role error:', err);
    res.status(500).json({ success: false, message: 'Failed to update role.' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    if (String(req.user._id) === String(req.params.id)) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }

    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
});

export default router;
