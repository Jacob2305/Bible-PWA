import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar.jsx';
import Home from './pages/Home/Home.jsx';
import Feed from './pages/Feed/Feed.jsx';
import Account from './pages/Account/Account.jsx';
import LoginPage from './pages/Login/LoginPage.jsx';
import Memorize from './pages/Memorize/Memorize.jsx';
import { AuthProvider } from './context/AuthContext';


import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';

function AppRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div>Loading...</div>;

  const isLoginPage = location.pathname === '/login';

  return (
    <>
      <main className="page-content">
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/feed"
            element={user ? <Feed /> : <Navigate to="/login" />}
          />
          <Route
            path="/account"
            element={user ? <Account /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/feed" />}
          />
          <Route
            path="/memorize"
            element={user ? <Memorize /> : <Navigate to="/login" />}
          />

        </Routes>
      </main>

      {!isLoginPage && <Navbar />}
    </>
  );
}

export default function App() {
  return (
    <Router basename="/Bible-PWA">
      <AuthProvider>
        <div className="app-container">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}