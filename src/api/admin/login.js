// Admin login API endpoint
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { checkRateLimit, getClientIP, RATE_LIMITS } from './_lib/rateLimit.js';

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Apply stricter rate limiting for login endpoint
  const clientIP = getClientIP(req);
  const rateLimitKey = `admin-login:${clientIP}`;
  const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.LOGIN.maxRequests, RATE_LIMITS.LOGIN.windowMs);

  if (!rateLimit.allowed) {
    return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
  }

  try {
    const { password } = req.body;

    if (!JWT_SECRET || !ADMIN_PASSWORD_HASH) {
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Compare using bcrypt when ADMIN_PASSWORD is stored as a hash, otherwise plain comparison.
    // To migrate to bcrypt: set ADMIN_PASSWORD to the output of bcrypt.hashSync('yourpassword', 12)
    const isBcryptHash = /^\$2[aby]\$/.test(ADMIN_PASSWORD);
    const isValid = isBcryptHash
      ? await bcrypt.compare(password, ADMIN_PASSWORD)
      : password === ADMIN_PASSWORD;

    if (!isValid) {
    // Verify password using bcrypt
    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { role: 'admin', timestamp: Date.now() },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set HTTP-only cookie; add Secure flag in production
    const securePart = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    res.setHeader('Set-Cookie', `admin_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict${securePart}`);

    return res.status(200).json({ message: 'Login successful' });
    // Set HTTP-only, Secure, SameSite cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const secureFlag = isProduction ? 'Secure; ' : '';
    res.setHeader('Set-Cookie', `admin_token=${token}; HttpOnly; ${secureFlag}Path=/; Max-Age=86400; SameSite=Strict`);

    // Return success without token in body (R-05)
    return res.status(200).json({
      success: true,
      expiresIn: '24h'
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}