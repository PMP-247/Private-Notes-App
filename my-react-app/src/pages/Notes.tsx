import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface Note {
  id: string;
  content: string;
  created_at: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/notes`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      } else if (res.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load notes');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  }, [navigate, API_URL]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
        credentials: 'include',
      });
      if (res.ok) {
        setNewNote('');
        fetchNotes();
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/notes/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) fetchNotes();
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-black font-black animate-pulse uppercase">Loading your private notes...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-black">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tight">My Private Notes</h1>
          <button onClick={() => navigate('/login')} className="text-sm font-black text-red-600 hover:text-pink-600 underline uppercase">
            Logout
          </button>
        </div>

        <form onSubmit={handleAddNote} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a new note..."
              className="flex-1 rounded-md border-2 border-blue-900 bg-white py-2 px-3 text-black font-medium focus:ring-2 focus:ring-pink-500 outline-none"
            />
            <button type="submit" className="bg-linear-to-r from-red-600 to-pink-500 text-white px-6 py-2 rounded-md font-black shadow-md hover:opacity-90 transition-opacity uppercase">
              Add
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600 font-bold">{error}</p>}
        </form>

        <div className="grid gap-4">
          {notes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border-2 border-blue-900 shadow-inner">
              <p className="text-black font-black uppercase">No notes yet. Add your first one above!</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="group bg-white p-5 rounded-lg border-2 border-blue-900 shadow-sm hover:shadow-pink-100 transition-all flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-black font-bold leading-relaxed">{note.content}</p>
                  <p className="text-[10px] text-pink-600 mt-4 font-black uppercase tracking-widest">
                    {new Date(note.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button onClick={() => handleDeleteNote(note.id)} className="ml-4 p-2 text-red-600 hover:text-pink-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
