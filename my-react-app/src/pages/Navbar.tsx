import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Navbar = () => {
  const [displayName, setDisplayName] = useState<string>('USER');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Removed 'error' as it was unused
        const { data } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .single();

        if (data?.display_name) setDisplayName(data.display_name.toUpperCase());
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Clearing backend session
    await fetch('http://localhost:5001/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white border-b-4 border-blue-900 px-6 py-4 shadow-sm mb-8">
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