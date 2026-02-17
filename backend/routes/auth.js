import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  // ... your register logic
});

// Login Route
router.post('/login', async (req, res) => {
  // ... your login logic (setting the cookie, etc.)
});

export default router;