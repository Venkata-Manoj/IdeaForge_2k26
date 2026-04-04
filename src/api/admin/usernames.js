// Admin usernames management API endpoint
import { connectToDatabase } from '../_lib/db.js';
import jwt from 'jsonwebtoken';

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

    // Parse query parameters
    const { page = 1, limit = 20, search = '', filter = 'all' } = req.query;
    const limitInt = Math.min(parseInt(limit) || 20, 100);
    const skip = (parseInt(page) - 1) * limitInt;

    // Build query
    const query = {};
    
    if (search) {
      // Escape special regex characters to prevent ReDoS
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
      .select('username isGenerated createdAt')
      .lean();

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limitInt);

    return res.status(200).json({
      usernames,
      pagination: {
        total,
        page: parseInt(page),
        limit: limitInt,
        totalPages
      }
    });

  } catch (error) {
    console.error('Admin usernames error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}