import { supabase } from '../supabaseClient.js';

export const authenticateUser = async (req, res, next) => {
  // Extract token from incoming request authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Splits "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Authentication token missing' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized structural catch' });
  }
};