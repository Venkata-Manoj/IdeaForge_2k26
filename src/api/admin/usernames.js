// Admin usernames management API endpoint
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

/**
 * Escape regex special characters to prevent ReDoS attacks
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
    const rateLimitKey = `admin-usernames:${clientIP}`;
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

    const db = await connectToDatabase();
    const User = db.model('User');

    // Parse query parameters with bounds checking
    const { page = 1, limit = 20, search = '', filter = 'all' } = req.query;
    const limitInt = Math.min(parseInt(limit) || 20, 100);
    const skip = (parseInt(page) - 1) * limitInt;
    // Cap limit to max 100 (R-11)
    const boundedLimit = Math.min(parseInt(limit) || 20, 100);
    const skip = (parseInt(page) - 1) * boundedLimit;

    // Build query
    const query = {};
    
    if (search) {
      // Escape special regex characters to prevent ReDoS
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Escape regex to prevent ReDoS (R-07)
      const escapedSearch = escapeRegex(search);
      query.username = { $regex: escapedSearch, $options: 'i' };
    }
    
    if (filter === 'generated') {
      query.isGenerated = true;
    } else if (filter === 'pending') {
      query.isGenerated = false;
    }

    // Get usernames with pagination
    const usernames = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitInt)
      .limit(boundedLimit)
      .select('username isGenerated createdAt')
      .lean();

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limitInt);
    const totalPages = Math.ceil(total / boundedLimit);

    return res.status(200).json({
      usernames,
      pagination: {
        total,
        page: parseInt(page),
        limit: limitInt,
        limit: boundedLimit,
        totalPages
      }
    });

  } catch (error) {
    console.error('Admin usernames error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}