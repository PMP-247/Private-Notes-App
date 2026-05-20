import express from 'express';
import { supabase } from '../supabaseClient.js';
const router = express.Router();

/**
 * GET ALL NOTES
 * Path: GET /api/notes
 */
router.get('/', async (req, res) => {
  try {
    // Uses req.supabase attached by your updated auth middleware
    const { data, error } = await req.supabase
      .from('notes')
      .select('*')
      .eq('user_id', req.user.id) 
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Wrap in an object to match frontend logic
    return res.json({ notes: data });
  } catch (err) {
    console.error('Fetch error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

/**
 * CREATE A NEW NOTE
 * Path: POST /api/notes
 */
router.post('/', async (req, res) => {
  const { title, content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const { data, error } = await req.supabase
      .from('notes')
      .insert([
        { 
          title: title || 'Untitled Note', 
          content, 
          user_id: req.user.id 
        }
      ])
      .select();

    if (error) throw error;

    // Returns { note: { ... } } for easy frontend state updates
    return res.status(201).json({ note: data[0] });
  } catch (err) {
    console.error('Create error:', err.message);
    return res.status(500).json({ error: 'Failed to create note' });
  }
});

/**
 * DELETE A NOTE
 * Path: DELETE /api/notes/:id
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await req.supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    return res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err.message);
    return res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;