// API endpoint to download certificate by ID
import { connectToDatabase } from './_lib/db.js';
import { generateCertificate } from './_lib/pdfGenerator.js';
import { checkRateLimit, getClientIP, RATE_LIMITS } from './_lib/rateLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Apply rate limiting to prevent certificate ID enumeration
  const clientIP = getClientIP(req);
  const rateLimitKey = `download-certificate:${clientIP}`;
  const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.PUBLIC.maxRequests, RATE_LIMITS.PUBLIC.windowMs);

  if (!rateLimit.allowed) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Certificate ID is required' });
    }

    // Validate certificate ID format to prevent injection
    const certIdRegex = /^IF2K26-[A-F0-9]{6}-[A-F0-9]{6}$/;
    if (!certIdRegex.test(id)) {
      return res.status(400).json({ error: 'Invalid certificate ID format' });
    }

    const db = await connectToDatabase();
    const Certificate = db.model('Certificate');

    const certificate = await Certificate.findOne({ certificateId: id });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Regenerate the PDF
    const pdfBytes = await generateCertificate({
      participantName: certificate.participantName,
      eventType: certificate.eventType,
      certificateId: certificate.certificateId,
      eventDate: certificate.generatedAt.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    const safeName = certificate.participantName.replace(/[^a-zA-Z0-9]/g, '_');
    res.setHeader('Content-Disposition', `attachment; filename="IDEAFORGE2k26_${safeName}_Certificate.pdf"`);

    // Send PDF as response
    return res.status(200).send(pdfBytes);

  } catch (error) {
    console.error('Certificate download error:', error);
    return res.status(500).json({ 
      error: 'Certificate download failed' 
    });
  }
}
