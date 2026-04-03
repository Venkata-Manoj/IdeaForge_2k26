// Export all certificates as ZIP
import { connectToDatabase } from '../_lib/db.js';
import { generateCertificate } from '../_lib/pdfGenerator.js';
import jwt from 'jsonwebtoken';
import JSZip from 'jszip';

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

    const certificates = await Certificate.find().lean();

    if (certificates.length === 0) {
      return res.status(404).json({ error: 'No certificates found' });
    }

    const zip = new JSZip();

    for (const cert of certificates) {
      const pdfBytes = await generateCertificate({
        participantName: cert.participantName,
        eventType: cert.eventType,
        certificateId: cert.certificateId,
        eventDate: new Date(cert.generatedAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      });

      const safeName = cert.participantName.replace(/[^a-zA-Z0-9]/g, '_');
      zip.file(`IDEAFORGE2k26_${safeName}_Certificate.pdf`, pdfBytes);
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="IDEAFORGE2k26_certificates.zip"');

    return res.status(200).send(zipBuffer);

  } catch (error) {
    console.error('Export ZIP error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
