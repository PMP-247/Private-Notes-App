import { createClient } from '@supabase/supabase-js';

export const authenticateUser = async (req, res, next) => {
  const token = req.cookies['sb-access-token'];

  if (!token) {
    return res.status(401).json({ error: 'No session cookie' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: { headers: { Authorization: `Bearer ${token}` } }
    }
  );

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: 'Invalid token' });

    req.user = user;
    req.supabase = supabase; 
    next();
  } catch (err) {
    res.status(401).json({ error: 'Auth crash' });
  }
};