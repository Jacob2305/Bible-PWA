import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bottom-nav">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? 'active' : '')}
        aria-label="Home"
      >
        <span className="material-icons">home</span>
      </NavLink>

      <NavLink
        to="/feed"
        className={({ isActive }) => (isActive ? 'active' : '')}
        aria-label="Feed"
      >
        <span className="material-icons">article</span>
      </NavLink>

      <NavLink
        to="/account"
        className={({ isActive }) => (isActive ? 'active' : '')}
        aria-label="Account"
      >
        <span className="material-icons">person</span>
      </NavLink>

      <NavLink
        to="/memorize"
        className={({ isActive }) => (isActive ? 'active' : '')}
        aria-label="Memorize"
      >
        <span className="material-icons">memory</span>
      </NavLink>
    </nav>
  )
}
