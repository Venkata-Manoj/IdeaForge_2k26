// Admin login API endpoint
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;

    if (!JWT_SECRET || !ADMIN_PASSWORD) {
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

  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}