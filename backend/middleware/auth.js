import { supabase } from '../supabaseClient.js';

export const authenticateUser = async (req, res, next) => {
  // 1. Read the cross-domain cookie directly
  const token = req.cookies['sb-access-token'];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token missing' });
  }

  try {
    // 2. Validate token directly with your Supabase instance
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // 3. Attach user payload to request object and pass control forward
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized structural catch' });
  }
};