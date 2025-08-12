import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Home from './pages/Home/Home.jsx';
import Feed from './pages/Feed/Feed.jsx';
import Account from './pages/Account/Account.jsx';
import LoginPage from './pages/Login/LoginPage.jsx';
import Memorize from './pages/Memorize/Memorize.jsx';
import Friends from './pages/Friends/Friends.jsx';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import './App.css'

function AppRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [forceLogin, setForceLogin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      // Reset force login when user changes
      if (u && !u.isAnonymous) {
        setForceLogin(false);
      }
    });
    return () => unsub();
  }, []);

  // Listen for force login requests from other components
  useEffect(() => {
    const handleForceLogin = () => {
      setForceLogin(true);
    };

    // You can trigger this event from other components
    window.addEventListener('forceLogin', handleForceLogin);
    return () => window.removeEventListener('forceLogin', handleForceLogin);
  }, []);

  if (loading) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px'
    }}>
      Loading...
    </div>
  );

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
            element={
              // Show login page if:
              // 1. No user at all, OR
              // 2. Force login is requested, OR  
              // 3. User is anonymous and trying to access login
              (!user || forceLogin || (user?.isAnonymous && location.pathname === '/login')) ? (
                <LoginPage onLoginSuccess={() => setForceLogin(false)} />
              ) : (
                <Navigate to="/feed" />
              )
            }
          />
          <Route
            path="/memorize"
            element={user ? <Memorize /> : <Navigate to="/login" />}
          />
          <Route
            path="/friends"
            element={
              user ? (
                user.isAnonymous ? (
                  <Navigate to="/login" />
                ) : (
                  <Friends currentUser={user} />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </main>
      {!isLoginPage && <Navbar user={user} />}
    </>
  );
}

export default function App() {
  return (
    <Router basename="/Bible-PWA">
      <div className="app-container">
        <AppRoutes />
      </div>
    </Router>
  );
}