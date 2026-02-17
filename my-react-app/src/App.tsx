import React, { useEffect, useState, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import Navbar from './pages/Navbar';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Using 127.0.0.1 to match backend and Login/Register fixes
        const res = await fetch('http://127.0.0.1:5001/api/notes', {
          method: 'GET',
          credentials: 'include', // Sends the secure cookie to the backend
        });

        if (res.status === 401) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(res.ok);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
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

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};


function App() {
  // Remove the variable name entirely to satisfy strict ESLint rules
  const handleAuthSuccess = () => { 
    console.log("Authentication successful");
    // Hard refresh ensures the session cookie is picked up by the browser
    window.location.href = "/notes";
  };
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-black">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login onAuthSuccess={handleAuthSuccess} />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/notes" 
            element={
              <ProtectedRoute>
                <Navbar />
                <Notes />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;