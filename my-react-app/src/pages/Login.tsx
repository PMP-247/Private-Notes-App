import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';

interface LoginProps {
  onAuthSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Send credentials straight to your Express backend
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to establish server session');
      }

      // Backend sets a secure HTTP-only session cookie
      // Tell App.tsx auth succeeded — it sets state and navigates to /notes
      onAuthSuccess();

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full">

        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-black uppercase">Welcome Back</h2>
          <p className="text-black font-bold mt-2 uppercase tracking-wide">
            Access your private vault
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5 bg-white p-8 shadow-xl rounded-2xl border-2 border-blue-900"
        >
          {error && (
            <div className="bg-red-50 border-2 border-blue-900 text-red-600 px-4 py-2 rounded-md text-sm font-bold">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-black text-black mb-1 uppercase"
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border-2 border-blue-900 px-3 py-2 text-black font-medium focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-black text-black mb-1 uppercase"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border-2 border-blue-900 px-3 py-2 text-black font-medium focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-black text-white bg-linear-to-r from-red-600 to-pink-500 shadow-lg hover:opacity-90 transition-all uppercase tracking-widest disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-bold text-black uppercase">
          New here?{' '}
          <Link
            to="/register"
            className="text-red-600 hover:text-pink-600 underline font-black"
          >
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;