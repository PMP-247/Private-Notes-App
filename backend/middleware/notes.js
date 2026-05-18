import express from 'express';
// Note: We don't import a static supabase client here anymore.
// We use the one attached to the request by our middleware.

const router = express.Router();

/**
 * GET ALL NOTES
 */
router.get('/', async (req, res) => {
  try {
    // 1. Use req.supabase (authenticated) instead of the static client
    const { data, error } = await req.supabase
      .from('notes')
      .select('*')
      .eq('user_id', req.user.id) 
      .order('created_at', { ascending: false });

    if (error) throw error;

    // 2. Wrap in an object to match your frontend logic: { notes: [...] }
    return res.json({ notes: data });
  } catch (err) {
    console.error('Fetch error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

/**
 * CREATE A NEW NOTE
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

    return res.status(201).json({ note: data[0] });
  } catch (err) {
    console.error('Create error:', err.message);
    return res.status(500).json({ error: 'Failed to create note' });
  }
});

/**
 * DELETE A NOTE
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