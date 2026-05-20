import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// 1. GET Notes Route (Casing matches lowercase 'notes' perfectly)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notes') 
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase GET Error:', error.message);
      return res.status(500).json({ error: `Supabase Table Error: ${error.message}` });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: `Server Fetch Exception: ${err.message}` });
  }
});

// 2. POST Note Route (Stripped of the missing 'title' column)
router.post('/', async (req, res) => {
  const { title, content } = req.body;

  try {
    // Combine the title and content cleanly into one string to fit your schema field
    const combinedContent = `${title}\n${content}`;

    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          content: combinedContent, // ✅ Matches your precise schema column
          user_id: req.user.id,     // ✅ Matches your precise schema column
        },
      ])
      .select();

    if (error) {
      console.error('Supabase POST Error:', error.message);
      return res.status(500).json({ error: `Supabase Insert Error: ${error.message}` });
    }

    // Map properties back so the frontend UI fields read successfully without breaking layout
    const formattedNote = {
      id: data[0].id,
      title: title,
      content: content,
      created_at: data[0].created_at,
      user_id: data[0].user_id
    };

    return res.status(201).json(formattedNote);
  } catch (err) {
    return res.status(500).json({ error: `Server Insert Exception: ${err.message}` });
  }
});

// 3. DELETE Note Route
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;