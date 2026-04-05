// Update username API endpoint
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
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    // Apply rate limiting
    const clientIP = getClientIP(req);
    const rateLimitKey = `admin-update:${clientIP}`;
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

    const { oldUsername, newUsername } = req.body;

    if (!oldUsername || !newUsername) {
      return res.status(400).json({ error: 'Both old and new usernames are required' });
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(newUsername)) {
      return res.status(400).json({ 
        error: 'Invalid new username format. Only letters, numbers, and underscores allowed (3-30 characters)' 
      });
    }

    const db = await connectToDatabase();
    const User = db.model('User');
    const Certificate = db.model('Certificate');

    const normalizedOld = oldUsername.toLowerCase().trim();
    const normalizedNew = newUsername.toLowerCase().trim();

    // Check if old username exists
    const user = await User.findOne({ username: normalizedOld });
    if (!user) {
      return res.status(404).json({ error: 'Old username not found' });
    }

    // Check if new username already exists
    const existingUser = await User.findOne({ username: normalizedNew });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res.status(409).json({ error: 'New username already exists' });
    }

    // Update username in User collection
    user.username = normalizedNew;
    await user.save();

    // Update username in Certificate collection if exists
    await Certificate.updateOne(
      { username: normalizedOld },
      { username: normalizedNew }
    );

    return res.status(200).json({ 
      message: `Username updated from '${oldUsername}' to '${newUsername}'`,
      wasGenerated: user.isGenerated
    });

  } catch (error) {
    console.error('Update username error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
