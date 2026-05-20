import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Get all notes for the authenticated user
router.get('/', async (req, res) => {
  try {
    // Queries the table directly using the user payload attached from your middleware
    const { data, error } = await supabase
      .from('notes') // 👈 If your table is capitalized in Supabase, change this to 'Notes'
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Query Error:', error.message);
      return res.status(500).json({ error: `Supabase structural error: ${error.message}` });
    }

    return res.json(data);
  } catch (err) {
    console.error('Catch Block Server Exception:', err.message);
    return res.status(500).json({ error: 'Internal Server Catch Exception' });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  const { title, content } = req.body;

  try {
    const { data, error } = await supabase
      .from('notes') // 👈 Match table casing here as well
      .insert([
        {
          title,
          content,
          user_id: req.user.id,
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('notes') // 👈 Match table casing here as well
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;