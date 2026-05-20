import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Navbar = () => {
  const [displayName, setDisplayName] = useState<string>('USER');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) return;

        const data = await res.json();
        const user = data.user;

        if (user?.user_metadata?.display_name) {
          setDisplayName(user.user_metadata.display_name.toUpperCase());
        } else if (user?.email) {
          setDisplayName(user.email.toUpperCase());
        }
      } catch (err) {
        console.error('Unable to load profile', err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    window.location.href = '/login';
  };

  return (
    <nav className="bg-blue-900 border-b-4 border-blue-900 px-6 py-4 shadow-sm mb-8">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xl font-black uppercase tracking-tighter text-black leading-none">
            Private <span className="text-red-600">Notes</span>
          </h1>
          <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest mt-1">
            Welcome, {displayName}
          </span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="bg-linear-to-r from-red-600 to-pink-500 text-white px-5 py-2 rounded-md font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform shadow-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;