// API endpoint to generate certificate
import { connectToDatabase } from './_lib/db.js';
import { generateCertificate } from './_lib/pdfGenerator.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    // Find user and check admin status
    const user = await User.findOne({ username: normalizedUsername });
    const isAdmin = user && user.isAdmin;

    // Validate username format for non-admin
    if (!isAdmin) {
      const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({ 
          error: 'Invalid username format', 
          details: { username: 'Invalid username format' }
        });
      }
    }

    // Admin usernames bypass isGenerated check
    if (isAdmin) {
      // Admin can generate multiple certificates without limits
      const certificateId = `IF2K26-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const pdfBytes = await generateCertificate({
        participantName: name,
        eventType: eventType,
        certificateId: certificateId,
        eventDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      });

      await Certificate.create({
        certificateId,
        username: normalizedUsername,
        participantName: name,
        eventType: eventType,
        generatedAt: new Date(),
        ipAddress: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
        userAgent: req.headers['user-agent'] || ''
      });

      res.setHeader('Content-Type', 'application/pdf');
      const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
      res.setHeader('Content-Disposition', `attachment; filename="IDEAFORGE2k26_${safeName}_Certificate.pdf"`);
      res.setHeader('X-Certificate-ID', certificateId);

      return res.status(200).send(pdfBytes);
    }

    // Validate username exists and is available (for non-admin)
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

    // Generate unique certificate ID
    const certificateId = `IF2K26-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Generate PDF certificate
    const pdfBytes = await generateCertificate({
      participantName: name,
      eventType: eventType,
      certificateId: certificateId,
      eventDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    });

    // Store certificate record in database
    await Certificate.create({
      certificateId,
      username: normalizedUsername,
      participantName: name,
      eventType: eventType,
      generatedAt: new Date(),
      ipAddress: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
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