// Admin stats API endpoint
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
    const Certificate = db.model('Certificate');

    // Get statistics
    const totalUsernames = await User.countDocuments();
    const certificatesGenerated = await User.countDocuments({ isGenerated: true });
    const remaining = totalUsernames - certificatesGenerated;
    const generationRate = totalUsernames > 0 
      ? Math.round((certificatesGenerated / totalUsernames) * 100) 
      : 0;

    // Get recent generations
    const recentGenerations = await Certificate.find()
      .sort({ generatedAt: -1 })
      .limit(10)
      .select('username participantName eventType generatedAt')
      .lean();

    return res.status(200).json({
      totalUsernames,
      certificatesGenerated,
      remaining,
      generationRate,
      recentGenerations: recentGenerations.map(c => ({
        username: c.username,
        name: c.participantName,
        eventType: c.eventType,
        time: c.generatedAt
      }))
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}