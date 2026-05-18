import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock, Plus, Trash2 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL ||
    'https://private-notes-app-1-ksks.onrender.com';

  // Get auth token
  const token = localStorage.getItem('token');

  // Fetch Notes
  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await fetch(`${API_URL}/api/notes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();

        // Handles both [] and { notes: [] }
        const actualNotes = Array.isArray(data)
          ? data
          : data.notes;

        setNotes(actualNotes || []);
      } else if (res.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch notes');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Network error fetching notes');
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, navigate, token]);

  // Initial Fetch
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Add Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newNote.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const lines = newNote.trim().split('\n');
      const title = lines[0].substring(0, 50);

      const res = await fetch(`${API_URL}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          content: newNote,
        }),
      });

      if (res.ok) {
        setNewNote('');
        await fetchNotes();
      } else if (res.status === 401) {
        navigate('/login');
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to save note');
      }
    } catch (err) {
      console.error(err);
      setError('Network error saving note');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Note
  const handleDeleteNote = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (res.ok) {
        setNotes((prev) =>
          prev.filter((note) => note.id !== id)
        );
      } else if (res.status === 401) {
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2
          className="animate-spin text-indigo-600"
          size={40}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-black uppercase tracking-tighter flex items-center gap-2">
            <Lock className="text-indigo-600" />
            Private Feed
          </h1>
        </header>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border-2 border-red-600 text-red-700 px-4 py-2 rounded-lg mb-6 font-bold uppercase text-xs">
            {error}
          </div>
        )}

        {/* Add Note */}
        <form
          onSubmit={handleAddNote}
          className="bg-white rounded-2xl shadow-xl border-2 border-blue-900 p-6 mb-10"
        >
          <textarea
            className="w-full h-32 resize-none outline-none text-black font-medium placeholder:text-slate-400 text-lg"
            placeholder="What's on your mind? (First line becomes title)"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />

          <div className="flex justify-end mt-4 border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !newNote.trim()}
              className="bg-linear-to-r from-indigo-600 to-blue-500 text-white px-6 py-2 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Plus size={18} />
              )}

              Save Note
            </button>
          </div>
        </form>

        {/* Notes Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-white p-6 rounded-2xl border-2 border-blue-900 shadow-lg group hover:-translate-y-1 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-black uppercase truncate pr-4">
                    {note.title}
                  </h3>

                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-slate-300 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <p className="text-slate-700 leading-relaxed line-clamp-5 whitespace-pre-wrap">
                  {note.content}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {new Date(note.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-300">
              <p className="font-bold text-slate-400 uppercase tracking-widest">
                No notes in the vault yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;