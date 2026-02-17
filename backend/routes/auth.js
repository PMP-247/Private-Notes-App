import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

/**
 * LOGIN ROUTE
 */
router.post('/login', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
   
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // 🍪 SET COOKIE (THIS IS THE CRITICAL PART)
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // true on Render
      sameSite: 'none', // REQUIRED for Vercel ↔ Render
      maxAge: 1000 * 60 * 60 * 24 * 7, 
    });

    return res.json({ user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * LOGOUT ROUTE 
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  });

  res.json({ message: 'Logged out' });
});

export default router;
