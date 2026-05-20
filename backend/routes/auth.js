import express from 'express';
// 1. Clean Named Import from your central client configuration
import { supabase } from '../supabaseClient.js'; 

const router = express.Router();

// 2. Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });
    
// Inside your router.post('/login', ...) code block
const isProduction = process.env.NODE_ENV === 'production';

res.cookie('sb-access-token', data.session.access_token, {
  httpOnly: true,
  secure: isProduction, // 👈 Must be FALSE if testing locally via HTTP
  sameSite: isProduction ? 'none' : 'lax', // 👈 Must be 'lax' if testing locally
  maxAge: 60 * 60 * 1000, 
  path: '/'
});
    return res.json({ user: data.user });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3. Check Auth Route
router.get('/me', async (req, res) => {
  const token = req.cookies['sb-access-token'];
  if (!token) return res.status(401).json({ error: 'No session' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid session' });

  return res.json({ user });
});

export default router;