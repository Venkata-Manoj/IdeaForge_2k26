// API endpoint to generate certificate
import { connectToDatabase } from './_lib/db.js';
import { generateCertificate } from './_lib/pdfGenerator.js';
import { randomBytes } from 'crypto';
import { checkRateLimit, getClientIP, RATE_LIMITS } from './_lib/rateLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Apply rate limiting
  const clientIP = getClientIP(req);
  const rateLimitKey = `generate-certificate:${clientIP}`;
  const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.PUBLIC.maxRequests, RATE_LIMITS.PUBLIC.windowMs);

  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
    });
  }

  try {
    const { username, name, eventType } = req.body;

    // Validate required fields
    if (!username || !name || !eventType) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        details: {
          username: !username ? 'Username is required' : undefined,
          name: !name ? 'Name is required' : undefined,
          eventType: !eventType ? 'Event type is required' : undefined
        }
      });
    }

    const normalizedUsername = username.toLowerCase().trim();

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(normalizedUsername)) {
      return res.status(400).json({ 
        error: 'Invalid username format', 
        details: { username: 'Only letters, numbers, and underscores allowed (3-30 characters)' }
      });
    }

    // Validate name format (alphabets and spaces only, 2-50 chars)
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ 
        error: 'Invalid name format', 
        details: { name: 'Only alphabets and spaces allowed (2-50 characters)' }
      });
    }

    // Validate event type
    const validEventTypes = ['Technical', 'Non-Technical'];
    if (!validEventTypes.includes(eventType)) {
      return res.status(400).json({ 
        error: 'Invalid event type', 
        details: { eventType: 'Must be either Technical or Non-Technical' }
      });
    }

    const db = await connectToDatabase();
    const User = db.model('User');
    const Certificate = db.model('Certificate');

    // Validate username exists and is available
    const user = await User.findOne({ username: normalizedUsername });

    if (!user) {
      return res.status(404).json({ 
        error: 'Username not found. Please contact admin.' 
      });
    }

    if (user.isGenerated) {
      return res.status(409).json({ 
        error: 'Certificate already generated for this username' 
      });
    }

    // Mark username as generated
    user.isGenerated = true;
    await user.save();

    // Generate unique certificate ID using cryptographically secure RNG
    const part1 = randomBytes(3).toString('hex').toUpperCase();
    const part2 = randomBytes(3).toString('hex').toUpperCase();
    const certificateId = `IF2K26-${part1}-${part2}`;

    // Generate PDF certificate
    const pdfBytes = await generateCertificate({
      participantName: name,
      eventType: eventType,
      certificateId: certificateId,
      eventDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    });

    // Sanitize IP: take only the first (client) IP from the forwarded chain
    const rawForwardedFor = req.headers['x-forwarded-for'];
    const ipAddress = rawForwardedFor
      ? rawForwardedFor.split(',')[0].trim()
      : req.socket?.remoteAddress;

    // Store certificate record in database
    await Certificate.create({
      certificateId,
      username: normalizedUsername,
      participantName: name,
      eventType: eventType,
      generatedAt: new Date(),
      ipAddress,
      userAgent: req.headers['user-agent'] || ''
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
    res.setHeader('Content-Disposition', `attachment; filename="IDEAFORGE2k26_${safeName}_Certificate.pdf"`);
    res.setHeader('X-Certificate-ID', certificateId);

    // Send PDF as response
    return res.status(200).send(pdfBytes);

  } catch (error) {
    console.error('Certificate generation error:', error);
    return res.status(500).json({ 
      error: 'Certificate generation failed' 
    });
  }
}