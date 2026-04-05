// Download CSV with username and participant name mapping
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
    const rateLimitKey = `admin-download-csv:${clientIP}`;
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
    const Certificate = db.model('Certificate');

    // Get all users
    const users = await User.find({}).sort({ username: 1 }).lean();

    // Build CSV content
    const rows = [];
    rows.push(['Username', 'Participant Name', 'Status', 'Certificate ID', 'Event Type', 'Generated Date'].join(','));

    for (const user of users) {
      let participantName = '';
      let certificateId = '';
      let eventType = '';
      let generatedDate = '';

      if (user.isGenerated) {
        const cert = await Certificate.findOne({ username: user.username }).lean();
        if (cert) {
          participantName = cert.participantName || '';
          certificateId = cert.certificateId || '';
          eventType = cert.eventType || '';
          generatedDate = cert.generatedAt ? new Date(cert.generatedAt).toISOString().split('T')[0] : '';
        }
      }

      rows.push([
        user.username,
        `"${participantName.replace(/"/g, '""')}"`, // Escape quotes for CSV
        user.isGenerated ? 'Generated' : 'Pending',
        certificateId,
        eventType,
        generatedDate
      ].join(','));
    }

    const csvContent = rows.join('\n');

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="ideaforge_usernames_export.csv"');
    
    return res.status(200).send(csvContent);

  } catch (error) {
    console.error('Download CSV error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
