import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { logo1Base64, logo2Base64, signatureBase64 } from './src/api/_lib/imageAssets.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localEnvPath = path.join(__dirname, '.env');

if (fs.existsSync(localEnvPath)) {
  const envFile = fs.readFileSync(localEnvPath, 'utf8');
  for (const line of envFile.split(/\r?\n/)) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;

    const separatorIndex = trimmedLine.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const app = express();
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

// Connect to MongoDB
let db;
async function connectDB() {
  if (db) return db;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is required');
  }
  db = await mongoose.connect(MONGODB_URI);
  return db;
}

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  isGenerated: { type: Boolean, default: false, index: true }
}, { timestamps: true });

// Certificate Schema
const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true },
  participantName: { type: String, required: true, trim: true },
  eventType: { type: String, required: true, enum: ['Technical', 'Non-Technical'] },
  generatedAt: { type: Date, default: Date.now, index: true },
  ipAddress: String,
  userAgent: String
}, { timestamps: true });

// PDF Generator (simplified for local server)
const PAGE_WIDTH = 841.89;
const PAGE_HEIGHT = 595.28;

const COLORS = {
  white: rgb(1, 1, 1),
  black: rgb(0, 0, 0),
  darkBlue: rgb(0.05, 0.22, 0.48),
  mediumBlue: rgb(0.10, 0.30, 0.55),
  bodyText: rgb(0.15, 0.15, 0.15),
  goldBorder: rgb(0.72, 0.60, 0.10),
  lightGold: rgb(0.82, 0.72, 0.28),
};

// Helper: draw wrapped paragraph with bold segments
function drawParagraph(page, textParts, options) {
  const { x, y, maxWidth, lineHeight, font, boldFont, size, color, boldColor } = options;
  let segments = [];
  for (const part of textParts) {
    if (typeof part === 'string') segments.push({ text: part, isBold: false });
    else segments.push({ text: part.text, isBold: part.bold || false });
  }
  let currentY = y, currentX = x, lineWords = [], lineWidths = [];
  function flushLine() {
    let drawX = x;
    for (let i = 0; i < lineWords.length; i++) {
      const { word, isBold } = lineWords[i];
      const f = isBold ? boldFont : font;
      const c = isBold ? (boldColor || color) : color;
      page.drawText(word, { x: drawX, y: currentY, size, font: f, color: c });
      drawX += lineWidths[i] + f.widthOfTextAtSize(' ', size);
    }
    currentY -= lineHeight;
    lineWords = []; lineWidths = []; currentX = x;
  }
  for (const seg of segments) {
    const f = seg.isBold ? boldFont : font;
    const words = seg.text.split(' ').filter(w => w.length > 0);
    for (const word of words) {
      const wordWidth = f.widthOfTextAtSize(word, size);
      const spaceWidth = f.widthOfTextAtSize(' ', size);
      if (currentX > x && currentX + wordWidth > x + maxWidth) flushLine();
      lineWords.push({ word, isBold: seg.isBold });
      lineWidths.push(wordWidth);
      currentX += wordWidth + spaceWidth;
    }
  }
  if (lineWords.length > 0) flushLine();
  return currentY;
}

async function generateCertificatePDF(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  // White background
  page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: COLORS.white });

  // Gold outer border
  page.drawRectangle({ x: 18, y: 18, width: PAGE_WIDTH - 36, height: PAGE_HEIGHT - 36, borderWidth: 4, borderColor: COLORS.goldBorder });
  // Thin inner border
  page.drawRectangle({ x: 26, y: 26, width: PAGE_WIDTH - 52, height: PAGE_HEIGHT - 52, borderWidth: 1, borderColor: COLORS.lightGold });

  // Embed Logos
  try {
    const logo1Bytes = Buffer.from(logo1Base64, 'base64');
    const logo1Image = await pdfDoc.embedPng(logo1Bytes);
    const targetWidth = 110;
    const scale = targetWidth / logo1Image.width;
    const targetHeight = logo1Image.height * scale;
    page.drawImage(logo1Image, {
      x: 40, y: PAGE_HEIGHT - 32 - targetHeight,
      width: targetWidth, height: targetHeight,
    });
  } catch (err) { console.error('Logo1 error:', err); }

  try {
    const logo2Bytes = Buffer.from(logo2Base64, 'base64');
    const logo2Image = await pdfDoc.embedPng(logo2Bytes);
    const targetWidth = 145;
    const scale = targetWidth / logo2Image.width;
    const targetHeight = logo2Image.height * scale;
    page.drawImage(logo2Image, {
      x: PAGE_WIDTH - 40 - targetWidth, y: PAGE_HEIGHT - 32 - targetHeight,
      width: targetWidth, height: targetHeight,
    });
  } catch (err) { console.error('Logo2 error:', err); }

  // "SIMATS ENGINEERING" header
  const headerText = 'SIMATS ENGINEERING';
  const headerSize = 38;
  const headerWidth = boldFont.widthOfTextAtSize(headerText, headerSize);
  page.drawText(headerText, { x: (PAGE_WIDTH - headerWidth) / 2, y: PAGE_HEIGHT - 85, size: headerSize, font: boldFont, color: COLORS.darkBlue });

  // "CERTIFICATE OF PARTICIPATION" subtitle
  const subtitleText = 'CERTIFICATE OF PARTICIPATION';
  const subtitleSize = 22;
  const subtitleWidth = boldFont.widthOfTextAtSize(subtitleText, subtitleSize);
  page.drawText(subtitleText, { x: (PAGE_WIDTH - subtitleWidth) / 2, y: PAGE_HEIGHT - 140, size: subtitleSize, font: boldFont, color: COLORS.mediumBlue });

  // Line under subtitle
  page.drawLine({ start: { x: 80, y: PAGE_HEIGHT - 155 }, end: { x: PAGE_WIDTH - 80, y: PAGE_HEIGHT - 155 }, thickness: 0.5, color: COLORS.lightGold });

  // Body paragraph
  const participantName = data.participantName || 'Participant';
  const eventType = data.eventType || 'Technical';
  const paragraphParts = [
    'This is to certify that ',
    { text: participantName, bold: true },
    ' has actively participated in the',
    { text: '\u201CIDEAFORGE 2K26\u201D', bold: true },
    ' organized by ',
    { text: '\u201CSIMATS Engineering Passion Pitch Club \u201D', bold: true },
    `as a contributor in the ${eventType} activity.`,
    'Your innovation and initiative reflect the spirit of building ideas that shape the future.',
  ];
  drawParagraph(page, paragraphParts, {
    x: 75, y: PAGE_HEIGHT - 200, maxWidth: PAGE_WIDTH - 150, lineHeight: 28,
    font, boldFont, size: 16, color: COLORS.bodyText, boldColor: COLORS.black,
  });

  // Signature line (bottom-right)
  const sigLineX = PAGE_WIDTH - 240;
  const sigLineEndX = PAGE_WIDTH - 60;
  const sigLineY = 95;
  page.drawLine({ start: { x: sigLineX, y: sigLineY }, end: { x: sigLineEndX, y: sigLineY }, thickness: 0.5, color: COLORS.bodyText });

  const hodText = 'Head of the Department';
  const hodWidth = italicFont.widthOfTextAtSize(hodText, 13);
  page.drawText(hodText, { x: sigLineX + (sigLineEndX - sigLineX) / 2 - hodWidth / 2, y: 75, size: 13, font: italicFont, color: COLORS.bodyText });

  // Embed Signature Image
  try {
    const sigBytes = Buffer.from(signatureBase64, 'base64');
    const sigImage = await pdfDoc.embedPng(sigBytes);
    const targetWidth = 160;
    const scale = targetWidth / sigImage.width;
    page.drawImage(sigImage, {
      x: sigLineX + (sigLineEndX - sigLineX) / 2 - (targetWidth / 2),
      y: sigLineY + 2,
      width: targetWidth, height: sigImage.height * scale,
    });
  } catch (err) { console.error('Signature error:', err); }

  // Date and Venue (bottom-left)
  page.drawText('Date:', { x: 75, y: 95, size: 13, font: boldFont, color: COLORS.bodyText });
  page.drawText(' 20/03/26', { x: 75 + boldFont.widthOfTextAtSize('Date:', 13), y: 95, size: 13, font, color: COLORS.bodyText });
  page.drawText('Venue:', { x: 75, y: 75, size: 13, font: boldFont, color: COLORS.bodyText });
  page.drawText(' SIMATS ENGINEERING', { x: 75 + boldFont.widthOfTextAtSize('Venue:', 13), y: 75, size: 13, font, color: COLORS.bodyText });

  return pdfDoc.save();
}

// API Routes

// Simple in-memory rate limiter (per IP, for local dev server)
const rateLimitStore = new Map();
function rateLimit(windowMs, maxRequests) {
  return (req, res, next) => {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;
    const timestamps = (rateLimitStore.get(ip) || []).filter(t => t > windowStart);
    timestamps.push(now);
    rateLimitStore.set(ip, timestamps);
    if (timestamps.length > maxRequests) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    next();
  };
}

// JWT auth middleware for admin routes
function requireAdmin(req, res, next) {
  if (!JWT_SECRET) return res.status(500).json({ error: 'Server misconfigured' });
  const cookie = req.headers.cookie || '';
  const tokenMatch = cookie.match(/admin_token=([^;]+)/);
  if (!tokenMatch) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(tokenMatch[1], JWT_SECRET);
    if (!decoded || decoded.role !== 'admin') return res.status(401).json({ error: 'Unauthorized' });
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// Validate Username
app.post('/api/validate-username', rateLimit(15 * 60 * 1000, 60), async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ valid: false, error: 'Username is required' });

    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ valid: false, error: 'Only letters, numbers, and underscores allowed (3-30 characters)' });
    }

    const connection = await connectDB();
    const User = connection.models.User || connection.model('User', userSchema);

    const user = await User.findOne({ username: username.toLowerCase().trim(), isGenerated: false });
    if (!user) {
      return res.status(404).json({ valid: false, error: 'Username not found. Please contact admin.' });
    }

    return res.status(200).json({ valid: true, message: 'Username is valid and available' });
  } catch (error) {
    console.error('Validate username error:', error);
    res.status(500).json({ valid: false, error: 'Internal server error' });
  }
});

// Generate Certificate
app.post('/api/generate-certificate', rateLimit(15 * 60 * 1000, 30), async (req, res) => {
  try {
    const { username, name, eventType } = req.body;

    if (!username || !name || !eventType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await connectDB();
    const User = connection.models.User || connection.model('User', userSchema);

    const user = await User.findOne({ username: username.toLowerCase().trim(), isGenerated: false });
    if (!user) {
      return res.status(404).json({ error: 'Username not found. Please contact admin.' });
    }

    user.isGenerated = true;
    await user.save();

    const certificateId = `IF2K26-${randomBytes(2).toString('hex').toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`;
    const eventDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const pdfBytes = await generateCertificatePDF({
      participantName: name,
      eventType: eventType,
      certificateId: certificateId,
      eventDate: eventDate
    });

    const Certificate = connection.models.Certificate || connection.model('Certificate', certificateSchema);
    await Certificate.create({
      certificateId,
      username: username.toLowerCase().trim(),
      participantName: name,
      eventType: eventType,
      generatedAt: new Date()
    });

    res.setHeader('Content-Type', 'application/pdf');
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
    res.setHeader('Content-Disposition', `attachment; filename="IDEAFORGE2k26_${safeName}_Certificate.pdf"`);
    res.setHeader('X-Certificate-ID', certificateId);
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ error: 'Certificate generation failed' });
  }
});

// Admin Login
app.post('/api/admin/login', rateLimit(15 * 60 * 1000, 10), async (req, res) => {
  try {
    const { password } = req.body;
    if (!JWT_SECRET || !ADMIN_PASSWORD) {
      return res.status(500).json({ error: 'Server misconfigured' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    // Use bcrypt compare when ADMIN_PASSWORD is stored as a hash
    const isBcryptHash = /^\$2[aby]\$/.test(ADMIN_PASSWORD);
    const isValid = isBcryptHash
      ? await bcrypt.compare(password, ADMIN_PASSWORD)
      : password === ADMIN_PASSWORD;
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    const securePart = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    res.setHeader('Set-Cookie', `admin_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict${securePart}`);
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get Usernames
app.get('/api/admin/usernames', requireAdmin, async (req, res) => {
  try {
    const connection = await connectDB();
    const User = connection.models.User || connection.model('User', userSchema);
    const usernames = await User.find().sort({ createdAt: -1 }).select('username isGenerated createdAt');
    res.status(200).json({ usernames, pagination: { total: usernames.length, page: 1, limit: 20, totalPages: 1 } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch usernames' });
  }
});

// Add Username
app.post('/api/admin/add', requireAdmin, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    const connection = await connectDB();
    const User = connection.models.User || connection.model('User', userSchema);

    const existing = await User.findOne({ username: username.toLowerCase().trim() });
    if (existing) return res.status(409).json({ error: 'Username already exists' });

    await User.create({ username: username.toLowerCase().trim(), isGenerated: false });
    res.status(201).json({ message: `Username '${username}' has been added` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add username' });
  }
});

// Delete Username
app.delete('/api/admin/delete', requireAdmin, async (req, res) => {
  try {
    const { username } = req.body;
    const connection = await connectDB();
    const User = connection.models.User || connection.model('User', userSchema);
    await User.deleteOne({ username: username.toLowerCase().trim() });
    res.status(200).json({ message: `Username '${username}' has been deleted` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete username' });
  }
});

// Reset Username
app.post('/api/admin/reset', requireAdmin, async (req, res) => {
  try {
    const { username } = req.body;
    const connection = await connectDB();
    const User = connection.models.User || connection.model('User', userSchema);
    await User.findOneAndUpdate({ username: username.toLowerCase().trim() }, { isGenerated: false });
    res.status(200).json({ message: `Username '${username}' has been reset` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset username' });
  }
});

// Get Stats
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const connection = await connectDB();
    const User = connection.models.User || connection.model('User', userSchema);
    const Certificate = connection.models.Certificate || connection.model('Certificate', certificateSchema);

    const totalUsernames = await User.countDocuments();
    const certificatesGenerated = await Certificate.countDocuments();

    res.status(200).json({
      totalUsernames,
      certificatesGenerated,
      remaining: totalUsernames - certificatesGenerated,
      generationRate: totalUsernames > 0 ? `${Math.round((certificatesGenerated / totalUsernames) * 100)}%` : '0%'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});
