import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export const authenticateUser = async (req, res, next) => {
  // 1. Get token from cookies
  const token = req.cookies['sb-access-token'];

  if (!token) {
    return res.status(401).json({ error: 'No session cookie found' });
  }

  // 2. Verify with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  // 3. Attach user and a fresh supabase client to the request
  req.user = user;
  req.supabase = supabase; 
  next();
};