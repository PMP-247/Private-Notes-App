import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    // Store session token in secure HTTP-only cookie
    if (data.session) {
      res.cookie('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 60 * 60 * 1000,
      });
    }

    return res.status(201).json({
      message: 'Registration successful',
      user: data.user,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        error: error.message,
      });
    }

    // Store session token in secure HTTP-only cookie
    res.cookie('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Login successful',
      user: data.user,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }
});

// CURRENT USER ROUTE
router.get('/me', async (req, res) => {
  const token = req.cookies['sb-access-token'];

  if (!token) {
    return res.status(401).json({
      error: 'No session',
    });
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({
      error: 'Invalid session',
    });
  }

  return res.json({ user });
});

export default router;