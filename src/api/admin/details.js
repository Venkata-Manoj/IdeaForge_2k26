// Get user details API endpoint (includes certificate info if generated)
import { connectToDatabase } from '../_lib/db.js';
import jwt from 'jsonwebtoken';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '../_lib/rateLimit.js';

const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    // Apply rate limiting
    const clientIP = getClientIP(req);
    const rateLimitKey = `admin-details:${clientIP}`;
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.ADMIN.maxRequests, RATE_LIMITS.ADMIN.windowMs);

    if (!rateLimit.allowed) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    // Verify admin token from cookie
    const cookie = req.headers.cookie || '';
    const tokenMatch = cookie.match(/admin_token=([^;]+)/);
    
    if (!tokenMatch) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = verifyToken(tokenMatch[1]);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const db = await connectToDatabase();
    const User = db.model('User');
    const Certificate = db.model('Certificate');

    const normalizedUsername = username.toLowerCase().trim();

    // Get user details
    const user = await User.findOne({ username: normalizedUsername }).lean();
    if (!user) {
      return res.status(404).json({ error: 'Username not found' });
    }

    // Get certificate details if generated
    let certificate = null;
    if (user.isGenerated) {
      certificate = await Certificate.findOne({ username: normalizedUsername }).lean();
    }

    return res.status(200).json({
      username: user.username,
      isGenerated: user.isGenerated,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      certificate: certificate ? {
        certificateId: certificate.certificateId,
        participantName: certificate.participantName,
        eventType: certificate.eventType,
        generatedAt: certificate.generatedAt,
        ipAddress: certificate.ipAddress
      } : null
    });

  } catch (error) {
    console.error('Get user details error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
