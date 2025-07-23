import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar/Navbar.jsx'
import Home from './pages/Home/Home.jsx'
import Feed from './pages/Feed/Feed.jsx'
import Account from './pages/Account/Account.jsx'

export default function App() {
  return (
    <Router basename="/Bible-PWA">
      <div className="app-container">
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </main>

        <Navbar />
      </div>
    </Router>
  )
}
