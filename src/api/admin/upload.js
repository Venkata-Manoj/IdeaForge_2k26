// Bulk upload usernames API endpoint
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

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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

    // Parse multipart form data
    const { default: Busboy } = await import('busboy');
    const { Writable } = await import('stream');
    
    const bb = Busboy({ headers: req.headers });
    const usernames = [];
    let errors = [];

    bb.on('file', (fieldname, file, filename) => {
      if (!filename.endsWith('.csv')) {
        errors.push('Invalid file type. Only CSV files are allowed.');
        file.resume();
        return;
      }

      let data = '';
      file.on('data', (chunk) => {
        data += chunk.toString();
      });

      file.on('end', () => {
        // Parse CSV
        const lines = data.split('\n').filter(line => line.trim());
        
        // Skip header if present
        const startIndex = lines[0]?.toLowerCase().includes('username') ? 1 : 0;
        
        for (let i = startIndex; i < lines.length; i++) {
          const username = lines[i].trim().replace(/,/g, '');
          if (username) {
            // Validate username format
            const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
            if (usernameRegex.test(username)) {
              usernames.push(username.toLowerCase());
            } else {
              errors.push(`Invalid format: ${username}`);
            }
          }
        }
      });
    });

    bb.on('finish', async () => {
      if (errors.length > 0 && usernames.length === 0) {
        return res.status(400).json({ error: errors[0], errors });
      }

      const db = await connectToDatabase();
      const User = db.model('User');

      const added = [];
      const skipped = [];

      for (const username of usernames) {
        const existing = await User.findOne({ username });
        if (existing) {
          skipped.push(`duplicate: ${username}`);
        } else {
          await User.create({ username, isGenerated: false });
          added.push(username);
        }
      }

      return res.status(200).json({
        added: added.length,
        skipped: skipped.length,
        errors: errors.concat(skipped)
      });
    });

    bb.on('error', (error) => {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'File processing failed' });
    });

    req.pipe(bb);

  } catch (error) {
    console.error('Bulk upload error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}