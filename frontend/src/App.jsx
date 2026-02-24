import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { Navigate } from 'react-router-dom';
import { useAuthStore } from './utils/authStore';
import { useEffect, useState } from 'react';


function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}





function App() {
  const refresh = useAuthStore((state) => state.refresh);
  const loading = useAuthStore((state) => state.loading);


  useEffect(() => {
    refresh();
  }, []);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-zinc-100 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )

  }

  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />


      </Routes>
    </Router>
  );
}

export default App;