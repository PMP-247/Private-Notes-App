import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Register = () => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });

      if (signUpError) throw signUpError;

   
      if (data.session) {
        await fetch('http://127.0.0.1:5001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: data.session.access_token }),
        });
        
       
        window.location.replace("/notes");
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-black uppercase">Create Account</h2>
          <p className="text-black font-bold mt-2 uppercase tracking-wide">Secure your private notes</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5 bg-white p-8 shadow-xl rounded-2xl border-2 border-blue-900">
          {error && (
            <div className="bg-red-50 border-2 border-blue-900 text-red-600 px-4 py-2 rounded-md text-sm font-bold">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="reg-displayName" className="block text-sm font-black text-black mb-1 uppercase">
              Display Name
            </label>
            <input
              id="reg-displayName"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-md border-2 border-blue-900 px-3 py-2 text-black font-medium focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-sm font-black text-black mb-1 uppercase">
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border-2 border-blue-900 px-3 py-2 text-black font-medium focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="reg-password" middle-name="password" className="block text-sm font-black text-black mb-1 uppercase">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border-2 border-blue-900 px-3 py-2 text-black font-medium focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="reg-confirmPassword" middle-name="confirm-password" className="block text-sm font-black text-black mb-1 uppercase">
              Confirm Password
            </label>
            <input
              id="reg-confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border-2 border-blue-900 px-3 py-2 text-black font-medium focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-black text-white bg-linear-to-r from-red-600 to-pink-500 shadow-lg hover:opacity-90 transition-all uppercase tracking-widest disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-bold text-black uppercase">
          Already a member?{' '}
          <Link to="/login" className="text-red-600 hover:text-pink-600 underline font-black">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;