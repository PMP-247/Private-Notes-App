import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });
    
const isProduction = process.env.NODE_VALUE === 'production';
    // SETTING THE CORRECT COOKIE FOR LOCAL & DEPLOYMENT
    res.cookie('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: true,      // Set to true; index.js "trust proxy" handles local testing
      sameSite: 'none',  // Crucial for cross-domain
      maxAge: 60 * 60 * 1000, 
      path: '/'
    });

    res.json({ user: data.user });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Check Auth Route (The one that was 404ing)
router.get('/me', async (req, res) => {
  const token = req.cookies['sb-access-token'];
  if (!token) return res.status(401).json({ error: 'No session' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid session' });

  res.json({ user });
});

export default router;