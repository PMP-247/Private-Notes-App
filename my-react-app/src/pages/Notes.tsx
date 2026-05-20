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

  // Fetch Notes
  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/notes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        const actualNotes = Array.isArray(data) ? data : data.notes;
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
  }, [API_URL, navigate]);

  // Initial Mount Hook
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
        credentials: 'include',
      });

      if (res.ok) {
        setNotes((prev) => prev.filter((note) => note.id !== id));
      } else if (res.status === 401) {
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-3xl font-black uppercase tracking-tighter text-black">
            <Lock className="text-indigo-600" />
            Private Feed
          </h1>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border-2 border-red-600 bg-red-100 px-4 py-2 text-xs font-bold uppercase text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleAddNote}
          className="mb-10 rounded-2xl border-2 border-blue-900 bg-white p-6 shadow-xl"
        >
          <textarea
            className="h-32 w-full resize-none text-lg font-medium text-black outline-none placeholder:text-slate-400"
            placeholder="What's on your mind? (First line becomes title)"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />

          <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !newNote.trim()}
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-blue-500 px-6 py-2 font-black uppercase tracking-widest text-white transition-transform hover:scale-105 disabled:opacity-50"
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.id}
                className="group rounded-2xl border-2 border-blue-900 bg-white p-6 shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="truncate pr-4 font-black uppercase text-black">
                    {note.title}
                  </h3>

                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-slate-300 transition-colors hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <p className="line-clamp-5 whitespace-pre-wrap leading-relaxed text-slate-700">
                  {note.content}
                </p>

                <div className="mt-4 flex items-center border-t border-slate-50 pt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {new Date(note.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-300 bg-white py-20 text-center">
              <p className="font-bold uppercase tracking-widest text-slate-400">
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