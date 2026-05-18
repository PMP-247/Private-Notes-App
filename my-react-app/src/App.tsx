import React, { useEffect, useState, useCallback, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';

// ─── Auth State Types ─────────────────────────────────────────────────────────
type AuthState = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

interface AuthContextValue {
  authState: AuthState;
  setAuthState: (state: AuthState) => void;
}

// ─── Auth Context ─────────────────────────────────────────────────────────────
const AuthContext = React.createContext<AuthContextValue>({
  authState: 'loading',
  setAuthState: () => {},
});

// ─── API URL from .env ────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
// ─── Auth Check ───────────────────────────────────────────────────────────────
// Hits /api/auth/me — validates the cookie without fetching any data
// ✅ Correct checkAuth
const checkAuth = async (): Promise<AuthState> => {
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      credentials: 'include', // CRITICAL: Tells browser to handle cookies
    });
    if (res.status === 401) return 'unauthenticated';
    if (res.ok) return 'authenticated';
    return 'error';
  } catch {
    return 'error';
  }
};

// ─── Protected Route ──────────────────────────────────────────────────────────
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authState } = React.useContext(AuthContext);

  if (authState === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-pink-600 mx-auto"></div>
          <p className="mt-4 text-black font-black uppercase tracking-widest animate-pulse">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  if (authState === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-lg">Unable to reach the server.</p>
          <p className="text-slate-500 mt-2 text-sm">
            Please check your connection and try again.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return authState === 'authenticated' ? <>{children}</> : <Navigate to="/login" replace />;
};

// ─── App Routes ───────────────────────────────────────────────────────────────
// Kept inside BrowserRouter so useNavigate works correctly
const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>('loading');

  const initAuth = useCallback(async () => {
    const state = await checkAuth();
    setAuthState(state);
  }, []);

  useEffect(() => {
  }, [initAuth]);

  // ✅ No token argument — Login handles Supabase auth, backend owns the cookie
const handleAuthSuccess = () => {
  setAuthState('authenticated');
  navigate('/notes');
};

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <div className="min-h-screen bg-slate-50 text-black">
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<Login onAuthSuccess={handleAuthSuccess} />} />
          <Route path="/register" element={<Register />} />

          {/* Protected — Navbar + Notes only render when authenticated */}
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Navbar />
                <Notes />
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;