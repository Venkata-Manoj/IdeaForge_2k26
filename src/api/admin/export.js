// Export certificates API endpoint
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
    const Certificate = db.model('Certificate');

    // Get all certificates
    const certificates = await Certificate.find()
      .sort({ generatedAt: -1 })
      .lean();

    // Generate CSV content
    const csvHeader = 'Certificate ID,Username,Participant Name,Event Type,Generated At,IP Address\n';
    const csvRows = certificates.map(c => 
      `${c.certificateId},${c.username},"${c.participantName}",${c.eventType},${new Date(c.generatedAt).toISOString()},${c.ipAddress || ''}`
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