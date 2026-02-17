import express from 'express';
const router = express.Router();

// 1. GET ALL NOTES (Authenticated)
router.get('/', async (req, res) => {
  // Use req.supabase, NOT the global supabase instance
  const { data, error } = await req.supabase
    .from('notes')
    .select('*');

  if (error) return res.status(401).json({ error: error.message });
  res.json(data);
});

// 2. CREATE A NOTE
router.post('/', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' }); // Add this check
  
  try {
    const { data, error } = await req.supabase
      .from('notes')
// ... rest of code
      .insert([{ 
        content, 
        user_id: req.user.id 
      }])
      .select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error creating note' });
  }
});

// 3. DELETE A NOTE
router.delete('/:id', async (req, res) => {
  try {
    // RLS in Supabase ensures a user can only delete a note 
    // if the user_id matches their own ID.
    const { error } = await req.supabase
      .from('notes')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting note' });
  }
});

export default router;