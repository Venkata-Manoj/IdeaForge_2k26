// API endpoint to validate username
import { connectToDatabase } from './_lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ valid: false, error: 'Method not allowed' });
  }

  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ valid: false, error: 'Username is required' });
    }

    const normalizedUsername = username.toLowerCase().trim();

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(normalizedUsername)) {
      return res.status(400).json({ 
        valid: false, 
        error: 'Only letters, numbers, and underscores allowed (3-30 characters)' 
      });
    }

    const db = await connectToDatabase();
    const User = db.model('User');
    
    // Find user by username
    const user = await User.findOne({ username: normalizedUsername });

    if (!user) {
      return res.status(404).json({ 
        valid: false, 
        error: 'Username not found. Please contact admin.' 
      });
    }

    // Check if certificate already generated
    if (user.isGenerated) {
      return res.status(409).json({ 
        valid: false, 
        error: 'Certificate already generated for this username.' 
      });
    }

    return res.status(200).json({ 
      valid: true, 
      message: 'Username is valid and available' 
    });

  } catch (error) {
    console.error('Username validation error:', error);
    return res.status(500).json({ 
      valid: false, 
      error: 'Internal server error' 
    });
  }
}