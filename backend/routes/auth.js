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
    
    // Fixed: Use process.env.NODE_ENV
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie('sb-access-token', data.session.access_token, {
      httpOnly: true,
      // Must be false on local http://localhost connections
      secure: isProduction,      
      // SameSite 'none' requires an encrypted HTTPS context. Use 'lax' locally.
      sameSite: isProduction ? 'none' : 'lax',  
      maxAge: 60 * 60 * 1000, 
      path: '/'
    });

    return res.json({ user: data.user });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Check Auth Route
router.get('/me', async (req, res) => {
  const token = req.cookies['sb-access-token'];
  if (!token) return res.status(401).json({ error: 'No session' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid session' });

  return res.json({ user });
});

export default router;