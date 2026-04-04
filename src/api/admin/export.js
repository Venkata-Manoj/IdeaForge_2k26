// Export certificates API endpoint
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
 * Escape a value for safe CSV inclusion.
 * Wraps in quotes and escapes internal quotes per RFC 4180.
 */
function csvEscape(value) {
  if (value == null) return '';
  const str = String(value);
  // If contains comma, quote, or newline, wrap in quotes and escape inner quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
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
    const rateLimitKey = `admin-export:${clientIP}`;
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
    const Certificate = db.model('Certificate');

    // Get all certificates
    const certificates = await Certificate.find()
      .sort({ generatedAt: -1 })
      .lean();

    // Generate CSV content with proper RFC 4180 escaping
    const csvHeader = 'Certificate ID,Username,Participant Name,Event Type,Generated At,IP Address\n';
    const csvRows = certificates.map(c => 
      [
        csvEscape(c.certificateId),
        csvEscape(c.username),
        csvEscape(c.participantName),
        csvEscape(c.eventType),
        csvEscape(new Date(c.generatedAt).toISOString()),
        csvEscape(c.ipAddress || '')
      ].join(',')
    ).join('\n');

    const csvContent = csvHeader + csvRows;

    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="ideaforge2k26_certificates_export.csv"');

    return res.status(200).send(csvContent);

  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}