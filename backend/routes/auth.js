import express from 'express';
import { supabase } from '../supabaseClient.js'; 

const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });
    
    // Pass the token back in the JSON body instead of a cookie
    return res.json({ 
      user: data.user,
      token: data.session.access_token 
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Check Auth Route
router.get('/me', async (req, res) => {
  // Read token from the Authorization header instead of cookies
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No session' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid session' });

  return res.json({ user });
});

export default router;