import { supabase } from '../supabaseClient.js';

export const authenticateUser = async (req, res, next) => {
  // Read token from HTTP-only cookie
  const token = req.cookies['sb-access-token'];

  console.log('COOKIE TOKEN:', token);

  // No token found
  if (!token) {
    return res.status(401).json({
      error: 'Authentication token missing',
    });
  }

  try {
    // Verify token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    // Invalid token or expired session
    if (error || !user) {
      return res.status(401).json({
        error: 'Invalid or expired session',
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (err) {
    console.error('AUTH MIDDLEWARE ERROR:', err);

    return res.status(401).json({
      error: 'Unauthorized',
    });
  }
};